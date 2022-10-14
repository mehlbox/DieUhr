#!/bin/sh
export DISPLAY=:0
/usr/bin/xset -dpms             # disable DPMS (Energy Star) features.
/usr/bin/xset s off             # disable screen saver
/usr/bin/xset s noblank         # don't blank the video device
sleep 1                         # prevent network issues
matchbox-window-manager -use_cursor no &
unclutter &
sudo -u pi /usr/bin/chromium --kiosk http://localhost/display.html
