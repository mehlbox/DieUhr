#!/usr/bin/env python3
import base64
import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.request


SERVER_URL = os.environ.get("KIOSK_SERVER", "https://dieuhr.bethaus-speyer.de").rstrip("/")
KIOSK_ID = os.environ.get("KIOSK_ID", "display")
KIOSK_NAME = os.environ.get("KIOSK_NAME", KIOSK_ID)
KIOSK_SECRET = os.environ.get("KIOSK_SECRET", "")
DISPLAY_NAME = os.environ.get("DISPLAY", ":0")
XAUTHORITY = os.environ.get("XAUTHORITY", "/home/pi/.Xauthority")
HEARTBEAT_INTERVAL = int(os.environ.get("KIOSK_HEARTBEAT_INTERVAL", "5"))
SCREENSHOT_PATH = os.environ.get("KIOSK_SCREENSHOT_PATH", "/tmp/kiosk-agent.png")
APP_VERSION = os.environ.get("KIOSK_AGENT_VERSION", "1.0.0")


def run(command):
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def get_hostname():
    _, stdout, _ = run(["hostname"])
    return stdout


def get_service_state():
    _, stdout, _ = run(["systemctl", "is-active", "kiosk.service"])
    return stdout or "unknown"


def get_browser_pid():
    _, stdout, _ = run(["pgrep", "-n", "-f", "chromium.*--kiosk"])
    return int(stdout) if stdout.isdigit() else None


def get_current_url():
    code, stdout, _ = run(["pgrep", "-af", "chromium.*--kiosk"])
    if code != 0 or not stdout:
        return ""

    last_line = stdout.splitlines()[-1]
    matches = re.findall(r"https?://\S+", last_line)
    return matches[-1] if matches else ""


def get_resolution():
    code, stdout, _ = run([
        "sudo",
        "-u",
        "pi",
        "env",
        f"DISPLAY={DISPLAY_NAME}",
        f"XAUTHORITY={XAUTHORITY}",
        "xdpyinfo",
    ])
    if code != 0:
        return ""

    match = re.search(r"dimensions:\s+(\d+x\d+)", stdout)
    return match.group(1) if match else ""


def capture_screenshot():
    if os.path.exists(SCREENSHOT_PATH):
        os.remove(SCREENSHOT_PATH)

    code, _, stderr = run([
        "sudo",
        "-u",
        "pi",
        "env",
        f"DISPLAY={DISPLAY_NAME}",
        f"XAUTHORITY={XAUTHORITY}",
        "scrot",
        "-z",
        SCREENSHOT_PATH,
    ])
    if code != 0:
        raise RuntimeError(stderr or "scrot failed")
    if not os.path.exists(SCREENSHOT_PATH):
        raise RuntimeError(f"screenshot file was not created at {SCREENSHOT_PATH}")

    with open(SCREENSHOT_PATH, "rb") as screenshot_file:
        return base64.b64encode(screenshot_file.read()).decode("ascii")


def post_json(path, payload):
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        SERVER_URL + path,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Kiosk-Secret": KIOSK_SECRET,
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def heartbeat():
    return heartbeat_with_result(None)


def heartbeat_with_result(action_result):
    payload = {
        "kioskId": KIOSK_ID,
        "name": KIOSK_NAME,
        "hostname": get_hostname(),
        "serviceState": get_service_state(),
        "browserPid": get_browser_pid(),
        "currentUrl": get_current_url(),
        "resolution": get_resolution(),
        "display": DISPLAY_NAME,
        "appVersion": APP_VERSION,
    }
    if action_result:
        payload["actionResult"] = action_result
    return post_json("/api/kiosk/heartbeat", payload)


def upload_screenshot(request_id):
    image_b64 = capture_screenshot()
    payload = {
        "kioskId": KIOSK_ID,
        "requestId": request_id,
        "contentType": "image/png",
        "imageBase64": image_b64,
    }
    return post_json("/api/kiosk/screenshot", payload)


def handle_action(action):
    if not isinstance(action, dict):
        return None

    action_type = str(action.get("type", "")).strip()
    request_id = str(action.get("requestId", "")).strip()
    if not action_type or not request_id:
        return None

    status = "unknown"
    try:
        if action_type == "restart-browser":
            code, _, stderr = run(["systemctl", "restart", "kiosk.service"])
            if code != 0:
                raise RuntimeError(stderr or "systemctl restart kiosk.service failed")
            status = "ok"
        else:
            status = "unsupported"
    except Exception as exc:
        print(f"Action error ({action_type}): {exc}", flush=True)
        status = "error"

    return {
        "type": action_type,
        "requestId": request_id,
        "status": status,
    }


def main():
    if not KIOSK_SECRET:
        raise SystemExit("KIOSK_SECRET is required")

    while True:
        try:
            response = heartbeat()
            action = response.get("action")
            if action:
                action_result = handle_action(action)
                if action_result:
                    response = heartbeat_with_result(action_result)

            if response.get("takeScreenshot") and response.get("screenshotRequestId"):
                upload_screenshot(response["screenshotRequestId"])
        except urllib.error.HTTPError as exc:
            print(f"HTTP error: {exc.code} {exc.reason}", flush=True)
        except urllib.error.URLError as exc:
            print(f"Connection error: {exc.reason}", flush=True)
        except Exception as exc:  # keep the loop alive on the kiosk
            print(f"Agent error: {exc}", flush=True)

        time.sleep(HEARTBEAT_INTERVAL)


if __name__ == "__main__":
    main()
