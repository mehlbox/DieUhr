# Kiosk Session Hint

Use this note at the start of the next session if kiosk/display work is needed.

## SSH access

- The display host is reachable with the system-wide SSH alias:
  - `ssh display`
- No extra host lookup is needed. The alias is already configured.

## Kiosk host facts

- The kiosk runs on the Raspberry Pi reachable as `display`.
- The browser display is managed by:
  - `kiosk.service`
- The kiosk agent for status/screenshot/restart is managed by:
  - `kiosk-agent.service`

## Relevant files on the Pi

- `/home/pi/kiosk.sh`
- `/home/pi/kiosk_agent.py`
- `/home/pi/kiosk-service.log`

## What the kiosk shows

- Chromium kiosk opens:
  - `https://dieuhr.bethaus-speyer.de/display`

## Useful checks

- Service status:
  - `ssh display 'systemctl status kiosk.service --no-pager -n 20'`
  - `ssh display 'systemctl status kiosk-agent.service --no-pager -n 20'`
- Browser process:
  - `ssh display 'ps -ef | grep chromium | grep -v grep'`
- Real screenshot on the Pi:
  - `ssh display 'sudo -u pi env DISPLAY=:0 XAUTHORITY=/home/pi/.Xauthority scrot -z /tmp/kiosk-live.png'`

## Current app integration

- The Flask app exposes kiosk endpoints for:
  - heartbeat
  - screenshot upload/request
  - browser restart request
- The controller UI includes:
  - kiosk online/offline status
  - real screenshot preview
  - `Chromium neu starten` button

## Important note

- If a future session needs kiosk work, tell the AI to read this file first:
  - [KIOSK_SESSION_HINT.md](/docker/dieuhr/KIOSK_SESSION_HINT.md:1)
