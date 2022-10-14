#!/bin/sh
export DISPLAY=:0
/usr/bin/xset -dpms             # disable DPMS (Energy Star) features.
/usr/bin/xset s off             # disable screen saver
/usr/bin/xset s noblank         # don't blank the video device
sleep 1                         # prevent network issues
#unclutter &
/usr/bin/chromium --start-fullscreen --kiosk --no-proxy-server --incognito http://localhost/display.html
