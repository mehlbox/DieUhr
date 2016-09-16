#!/bin/sh
export DISPLAY=":0"
xset -dpms # disable DPMS (Energy Star) features.
xset s off # disable screen saver
xset s noblank # don't blank the video device
unclutter &
matchbox-window-manager &
#while true; do # Use this to restart midori when crashed
midori -e Fullscreen -a http://localhost/display.php
#done

