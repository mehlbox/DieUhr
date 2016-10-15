#!/bin/sh
export DISPLAY=":0"
xset -dpms 		# disable DPMS (Energy Star) features.
xset s off 		# disable screen saver
xset s noblank 	# don't blank the video device
matchbox-window-manager -use_cursor no&
#while true; do # Use this to automatically restart midori when crashed
midori -e Fullscreen -a http://localhost/display.html?display=main
#done

