from flask import Flask, request, jsonify, Response, render_template, redirect, url_for, send_file
import os
import json
import time
import threading
import secrets
import base64
import re
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

AUTH_USERNAME = os.getenv('BASIC_AUTH_USERNAME', '')
AUTH_PASSWORD = os.getenv('BASIC_AUTH_PASSWORD', '')
ASSET_VERSION = os.getenv('ASSET_VERSION') or str(int(time.time()))
KIOSK_SHARED_SECRET = os.getenv('KIOSK_SHARED_SECRET', '')
KIOSK_STALE_AFTER = int(os.getenv('KIOSK_STALE_AFTER', '20'))
KIOSK_SCREENSHOT_TTL = int(os.getenv('KIOSK_SCREENSHOT_TTL', '60'))
KIOSK_SCREENSHOT_DIR = os.path.join(app.root_path, 'kiosk_screenshots')
KIOSK_ID_PATTERN = re.compile(r'^[A-Za-z0-9._-]{1,64}$')

PUBLIC_PATHS = {
    '/display',
    '/display.html',
    '/display.css',
    '/favicon.ico',
    '/svg/stopwatch.svg',
    '/js/jquery.js',
    '/js/bigtext.js',
    '/js/displayFunction.js',
    '/js/display.js',
}

state_lock = threading.RLock()
os.makedirs(KIOSK_SCREENSHOT_DIR, exist_ok=True)

DEFAULT_DATA = {
    'onOff': 'off',
    'upperLine': 'clock',
    'lowerLine': 'textarea',
    'displayChange': 0,
    'timeout': '300',
    'timeoutTimestamp': 'inf',
    'countdown': 300,
    'countdownTimeout': 300,
    'countdownState': 'stop',
    'message': '',
    'stateVersion': 0,
}

data = DEFAULT_DATA.copy()
kiosks = {}


def unauthorized_response():
    return Response(
        'Authentication required',
        401,
        {'WWW-Authenticate': 'Basic realm="Restricted"'}
    )


def normalize_kiosk_id(value):
    kiosk_id = (value or '').strip()
    if not kiosk_id or not KIOSK_ID_PATTERN.fullmatch(kiosk_id):
        return None
    return kiosk_id


def kiosk_api_response(status_code, message):
    return jsonify({'error': message}), status_code


def kiosk_secret_is_valid(payload):
    if not KIOSK_SHARED_SECRET:
        return False

    provided_secret = request.headers.get('X-Kiosk-Secret', '')
    if not provided_secret and isinstance(payload, dict):
        provided_secret = str(payload.get('secret', ''))

    return bool(provided_secret) and secrets.compare_digest(provided_secret, KIOSK_SHARED_SECRET)


def is_public_request():
    if request.path in PUBLIC_PATHS:
        return True

    if request.path == '/data' and request.method == 'GET':
        return True

    if request.path in {'/api/kiosk/heartbeat', '/api/kiosk/screenshot'} and request.method == 'POST':
        return True

    return False


@app.before_request
def enforce_basic_auth():
    if is_public_request():
        return None

    auth = request.authorization
    if (
        auth
        and auth.type == 'basic'
        and secrets.compare_digest(auth.username or '', AUTH_USERNAME)
        and secrets.compare_digest(auth.password or '', AUTH_PASSWORD)
    ):
        return None

    return unauthorized_response()


@app.after_request
def disable_ui_asset_cache(response):
    cache_sensitive_paths = ('/', '/display', '/index.html', '/display.html')
    cache_sensitive_extensions = ('.js', '.css')

    if request.method == 'GET' and (
        request.path in cache_sensitive_paths
        or request.path.endswith(cache_sensitive_extensions)
    ):
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response

def init_data():
    global data
    with state_lock:
        data = DEFAULT_DATA.copy()


def snapshot_data():
    with state_lock:
        snapshot = data.copy()
    snapshot['timestamp'] = int(time.time())
    return snapshot


def expire_kiosk_screenshot(kiosk_data, screenshot_path):
    kiosk_data.pop('screenshotPath', None)
    kiosk_data.pop('lastScreenshotAt', None)
    kiosk_data.pop('lastScreenshotRequestId', None)

    if screenshot_path and os.path.exists(screenshot_path):
        try:
            os.remove(screenshot_path)
        except OSError:
            pass


def build_kiosk_snapshot(kiosk_id, kiosk_data, now=None):
    now = now or int(time.time())
    last_seen = int(kiosk_data.get('lastSeen', 0) or 0)
    last_screenshot_at = int(kiosk_data.get('lastScreenshotAt', 0) or 0)
    screenshot_path = kiosk_data.get('screenshotPath')
    if (
        screenshot_path
        and last_screenshot_at
        and KIOSK_SCREENSHOT_TTL > 0
        and (now - last_screenshot_at) > KIOSK_SCREENSHOT_TTL
    ):
        expire_kiosk_screenshot(kiosk_data, screenshot_path)
        screenshot_path = None
        last_screenshot_at = 0

    snapshot = {
        'id': kiosk_id,
        'name': kiosk_data.get('name') or kiosk_id,
        'hostname': kiosk_data.get('hostname', ''),
        'currentUrl': kiosk_data.get('currentUrl', ''),
        'serviceState': kiosk_data.get('serviceState', ''),
        'browserPid': kiosk_data.get('browserPid'),
        'resolution': kiosk_data.get('resolution', ''),
        'display': kiosk_data.get('display', ''),
        'appVersion': kiosk_data.get('appVersion', ''),
        'remoteAddr': kiosk_data.get('remoteAddr', ''),
        'lastSeen': last_seen,
        'ageSeconds': max(0, now - last_seen) if last_seen else None,
        'online': bool(last_seen) and (now - last_seen) <= KIOSK_STALE_AFTER,
        'lastScreenshotAt': last_screenshot_at or None,
        'pendingScreenshotRequestId': kiosk_data.get('pendingScreenshotRequestId'),
        'requestedScreenshotAt': kiosk_data.get('requestedScreenshotAt'),
        'lastScreenshotRequestId': kiosk_data.get('lastScreenshotRequestId'),
        'pendingActionType': kiosk_data.get('pendingActionType'),
        'pendingActionRequestId': kiosk_data.get('pendingActionRequestId'),
        'pendingActionRequestedAt': kiosk_data.get('pendingActionRequestedAt'),
        'lastActionType': kiosk_data.get('lastActionType'),
        'lastActionRequestId': kiosk_data.get('lastActionRequestId'),
        'lastActionStatus': kiosk_data.get('lastActionStatus'),
        'lastActionAt': kiosk_data.get('lastActionAt'),
    }

    if screenshot_path and os.path.exists(screenshot_path) and last_screenshot_at:
        snapshot['screenshotUrl'] = url_for(
            'get_kiosk_screenshot',
            kiosk_id=kiosk_id,
            v=last_screenshot_at,
        )
    else:
        snapshot['screenshotUrl'] = None

    return snapshot


def snapshot_kiosks():
    now = int(time.time())
    with state_lock:
        items = [
            build_kiosk_snapshot(kiosk_id, kiosks[kiosk_id], now)
            for kiosk_id in sorted(kiosks.keys())
        ]
    return {
        'items': items,
        'timestamp': now,
        'staleAfter': KIOSK_STALE_AFTER,
    }

 
@app.route('/command', methods=['POST'])
def handle_command():
    command = request.form.get('command')
    if command == 'delete':
        init_data()
        return 'Deleted', {'Content-Type': 'text/plain'}
    return f'Invalid command: {command}', 400

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(snapshot_data())


@app.route('/api/kiosk/heartbeat', methods=['POST'])
def kiosk_heartbeat():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return kiosk_api_response(400, 'Expected JSON payload.')

    if not KIOSK_SHARED_SECRET:
        return kiosk_api_response(503, 'Kiosk integration is not configured.')

    if not kiosk_secret_is_valid(payload):
        return kiosk_api_response(401, 'Invalid kiosk secret.')

    kiosk_id = normalize_kiosk_id(payload.get('kioskId'))
    if not kiosk_id:
        return kiosk_api_response(400, 'Invalid kioskId.')

    now = int(time.time())
    remote_addr = request.headers.get('X-Forwarded-For', request.remote_addr or '')

    with state_lock:
        kiosk = kiosks.setdefault(kiosk_id, {})
        kiosk.update({
            'name': (payload.get('name') or kiosk_id).strip(),
            'hostname': str(payload.get('hostname', '')).strip(),
            'currentUrl': str(payload.get('currentUrl', '')).strip(),
            'serviceState': str(payload.get('serviceState', '')).strip(),
            'browserPid': payload.get('browserPid'),
            'resolution': str(payload.get('resolution', '')).strip(),
            'display': str(payload.get('display', '')).strip(),
            'appVersion': str(payload.get('appVersion', '')).strip(),
            'remoteAddr': remote_addr,
            'lastSeen': now,
        })

        action_result = payload.get('actionResult')
        if isinstance(action_result, dict):
            request_id = str(action_result.get('requestId', '')).strip() or None
            action_type = str(action_result.get('type', '')).strip() or None
            action_status = str(action_result.get('status', '')).strip() or 'unknown'
            if request_id:
                kiosk['lastActionRequestId'] = request_id
            if action_type:
                kiosk['lastActionType'] = action_type
            kiosk['lastActionStatus'] = action_status
            kiosk['lastActionAt'] = now

            if request_id and request_id == kiosk.get('pendingActionRequestId'):
                kiosk.pop('pendingActionType', None)
                kiosk.pop('pendingActionRequestId', None)
                kiosk.pop('pendingActionRequestedAt', None)

        pending_request_id = kiosk.get('pendingScreenshotRequestId')
        last_screenshot_request_id = kiosk.get('lastScreenshotRequestId')
        should_capture = bool(pending_request_id and pending_request_id != last_screenshot_request_id)
        pending_action_type = kiosk.get('pendingActionType')
        pending_action_request_id = kiosk.get('pendingActionRequestId')
        last_action_request_id = kiosk.get('lastActionRequestId')
        action = None
        if (
            pending_action_type
            and pending_action_request_id
            and pending_action_request_id != last_action_request_id
        ):
            action = {
                'type': pending_action_type,
                'requestId': pending_action_request_id,
            }
        snapshot = build_kiosk_snapshot(kiosk_id, kiosk, now)

    return jsonify({
        'ok': True,
        'timestamp': now,
        'takeScreenshot': should_capture,
        'screenshotRequestId': pending_request_id if should_capture else None,
        'action': action,
        'kiosk': snapshot,
    })


@app.route('/api/kiosk/screenshot', methods=['POST'])
def kiosk_screenshot():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return kiosk_api_response(400, 'Expected JSON payload.')

    if not KIOSK_SHARED_SECRET:
        return kiosk_api_response(503, 'Kiosk integration is not configured.')

    if not kiosk_secret_is_valid(payload):
        return kiosk_api_response(401, 'Invalid kiosk secret.')

    kiosk_id = normalize_kiosk_id(payload.get('kioskId'))
    if not kiosk_id:
        return kiosk_api_response(400, 'Invalid kioskId.')

    image_b64 = payload.get('imageBase64', '')
    if not image_b64:
        return kiosk_api_response(400, 'Missing imageBase64.')

    request_id = str(payload.get('requestId', '')).strip() or None

    try:
        image_bytes = base64.b64decode(image_b64, validate=True)
    except (ValueError, TypeError):
        return kiosk_api_response(400, 'Invalid imageBase64 payload.')

    if len(image_bytes) > 5 * 1024 * 1024:
        return kiosk_api_response(413, 'Screenshot payload too large.')

    screenshot_path = os.path.join(KIOSK_SCREENSHOT_DIR, f'{kiosk_id}.png')
    with open(screenshot_path, 'wb') as screenshot_file:
        screenshot_file.write(image_bytes)

    now = int(time.time())
    with state_lock:
        kiosk = kiosks.setdefault(kiosk_id, {})
        kiosk['screenshotPath'] = screenshot_path
        kiosk['lastScreenshotAt'] = now
        kiosk['lastScreenshotRequestId'] = request_id or kiosk.get('pendingScreenshotRequestId')
        if kiosk.get('pendingScreenshotRequestId') == kiosk.get('lastScreenshotRequestId'):
            kiosk.pop('pendingScreenshotRequestId', None)
            kiosk.pop('requestedScreenshotAt', None)
        snapshot = build_kiosk_snapshot(kiosk_id, kiosk, now)

    return jsonify({
        'ok': True,
        'timestamp': now,
        'kiosk': snapshot,
    })


@app.route('/api/kiosks', methods=['GET'])
def get_kiosks():
    return jsonify(snapshot_kiosks())


@app.route('/api/kiosks/<kiosk_id>/request-screenshot', methods=['POST'])
def request_kiosk_screenshot(kiosk_id):
    kiosk_id = normalize_kiosk_id(kiosk_id)
    if not kiosk_id:
        return kiosk_api_response(400, 'Invalid kioskId.')

    now = int(time.time())
    request_id = secrets.token_hex(8)

    with state_lock:
        kiosk = kiosks.setdefault(kiosk_id, {'name': kiosk_id})
        kiosk['pendingScreenshotRequestId'] = request_id
        kiosk['requestedScreenshotAt'] = now
        snapshot = build_kiosk_snapshot(kiosk_id, kiosk, now)

    return jsonify({
        'ok': True,
        'timestamp': now,
        'kiosk': snapshot,
    })


@app.route('/api/kiosks/<kiosk_id>/restart-browser', methods=['POST'])
def request_kiosk_browser_restart(kiosk_id):
    kiosk_id = normalize_kiosk_id(kiosk_id)
    if not kiosk_id:
        return kiosk_api_response(400, 'Invalid kioskId.')

    now = int(time.time())
    request_id = secrets.token_hex(8)

    with state_lock:
        kiosk = kiosks.setdefault(kiosk_id, {'name': kiosk_id})
        kiosk['pendingActionType'] = 'restart-browser'
        kiosk['pendingActionRequestId'] = request_id
        kiosk['pendingActionRequestedAt'] = now
        snapshot = build_kiosk_snapshot(kiosk_id, kiosk, now)

    return jsonify({
        'ok': True,
        'timestamp': now,
        'kiosk': snapshot,
    })


@app.route('/api/kiosks/<kiosk_id>/screenshot', methods=['GET'])
def get_kiosk_screenshot(kiosk_id):
    kiosk_id = normalize_kiosk_id(kiosk_id)
    if not kiosk_id:
        return kiosk_api_response(400, 'Invalid kioskId.')

    now = int(time.time())
    with state_lock:
        kiosk = kiosks.get(kiosk_id)
        if not kiosk or not kiosk.get('screenshotPath'):
            return kiosk_api_response(404, 'Screenshot not found.')
        screenshot_path = kiosk['screenshotPath']
        last_screenshot_at = int(kiosk.get('lastScreenshotAt', 0) or 0)
        if (
            last_screenshot_at
            and KIOSK_SCREENSHOT_TTL > 0
            and (now - last_screenshot_at) > KIOSK_SCREENSHOT_TTL
        ):
            expire_kiosk_screenshot(kiosk, screenshot_path)
            return kiosk_api_response(404, 'Screenshot expired.')

    if not os.path.exists(screenshot_path):
        return kiosk_api_response(404, 'Screenshot file missing.')

    return send_file(screenshot_path, mimetype='image/png', max_age=0)

@app.route('/main', methods=['GET', 'POST'])
def main():
    global data
    if request.method == 'GET':
        return jsonify(snapshot_data())

    if request.method == 'POST' and 'data' in request.form:
        try:
            new_data = json.loads(request.form['data'])
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON in form field "data".'}), 400

        if not isinstance(new_data, dict):
            return jsonify({'error': 'Payload must be a JSON object.'}), 400

        requested_base_version = new_data.pop('baseVersion', None)
        try:
            if requested_base_version is not None:
                requested_base_version = int(requested_base_version)
        except (TypeError, ValueError):
            return jsonify({'error': '"baseVersion" must be an integer.'}), 400

        log_text_submission = bool(new_data.pop('logMessage', False))

        with state_lock:
            current_version = int(data.get('stateVersion', 0))
            if requested_base_version is not None and requested_base_version != current_version:
                conflict_snapshot = data.copy()
                conflict_snapshot['timestamp'] = int(time.time())
                conflict_snapshot['error'] = 'State changed by another client.'
                return jsonify(conflict_snapshot), 409

            if 'timeoutTimestamp' in new_data and new_data['timeoutTimestamp'] != 'inf':
                new_data['timeoutTimestamp'] = int(new_data['timeoutTimestamp']) + int(time.time())

            data.update(new_data)
            data['stateVersion'] = current_version + 1
            response_data = data.copy()
            response_data['timestamp'] = int(time.time())

        if log_text_submission:
            submitted_message = new_data.get('message', '')
            log_entry = f"{datetime.now().strftime('%a %d.%m.%Y %H:%M:%S')} Message: {submitted_message} by: {request.remote_addr}"
            with open(os.path.join(app.root_path, 'log.txt'), 'a', encoding='utf-8') as log_file:
                log_file.write(log_entry + '\n')

        return jsonify(response_data), 200

    return jsonify({'error': 'Missing form field "data".'}), 400

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', asset_version=ASSET_VERSION, debug_mode=False)


@app.route('/debug', methods=['GET'])
def debug_index():
    return render_template('index.html', asset_version=ASSET_VERSION, debug_mode=True)


@app.route('/index.html', methods=['GET'])
def index_static_redirect():
    return redirect(url_for('index', v=ASSET_VERSION), code=302)

@app.route('/display', methods=['GET'])
def display():
    return render_template('display.html', asset_version=ASSET_VERSION)


@app.route('/display.html', methods=['GET'])
def display_static_redirect():
    return redirect(url_for('display', v=ASSET_VERSION), code=302)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
