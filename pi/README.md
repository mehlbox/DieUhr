# Kiosk Agent

This folder contains the Pi-side helper that reports kiosk status to the Flask app and uploads real screenshots on request.

## Files

- `kiosk_agent.py`: heartbeat loop plus screenshot capture via `scrot`
- `kiosk-agent.service.example`: systemd unit example

## Expected Pi setup

- `kiosk.service` already runs Chromium on `DISPLAY=:0`
- `scrot` is installed
- Python 3 is installed

## Install on the Pi

Copy the agent to the display host:

```bash
scp pi/kiosk_agent.py display:/home/pi/kiosk_agent.py
scp pi/kiosk-agent.service.example display:/tmp/kiosk-agent.service
```

On the Pi:

```bash
chmod +x /home/pi/kiosk_agent.py
sudo cp /tmp/kiosk-agent.service /etc/systemd/system/kiosk-agent.service
sudo sed -i 's/replace-me/<your kiosk shared secret>/' /etc/systemd/system/kiosk-agent.service
sudo systemctl daemon-reload
sudo systemctl enable --now kiosk-agent.service
```

## Required app configuration

Set the same shared secret in your Flask app:

```env
KIOSK_SHARED_SECRET=<your kiosk shared secret>
```
