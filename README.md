# DieUhr
- A Clock on a monitor which can be switched to display announcements or a countdown clock.
- Tested on RASPBIAN JESSIE LITE from https://www.raspberrypi.org/downloads/raspbian/ 

## how to install on a raspberry pi:
```bash
sudo su
apt-get update && apt-get upgrade -y
apt-get install midori matchbox xinit xdotool x11-xserver-utils git apache2 php libapache2-mod-php -y
apt-get install xorg -y # for rpi2
rm /var/www/html/index.html
git clone https://github.com/mehlbox/DieUhr.git /var/www/html/
chmod 777 /var/www/html
xinit /var/www/html/startMidori.sh
```
- add ```xinit /var/www/html/startMidori.sh``` to ```/etc/rc.local``` for autostart
- control your display by calling http://raspberrypi on your smartphone

## advanced
- Use any single board computer with HDMI out to be a display unit.
- You can have more than one display unit calling the same page from the webserver. This is less expensive then using a hdmi matrix with converter for long wiring. 
- Webserver can run independent on a seperate machine. Any webserver with php capabilities is good enough. Use just one webserver for many display units.
- On yor display unit: run a browser in fullscreen and point it to http://[webserver]/display.html
- Control your display by calling http://[webserver] on your smartphone or comupter.
- Use ```/etc/systemd/timesyncd.conf``` to manually choose the prefered ntp server.

## info
- https://github.com/zachleat/BigText is used to auto-resize font on screen


