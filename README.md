# DieUhr
- A Clock with some functions to work as a display board 
- I recommend to use RASPBIAN JESSIE LITE from https://www.raspberrypi.org/downloads/raspbian/

## how to install on a raspberry pi:
```bash
sudo su
apt-get update && apt-get upgrade -y
apt-get install midori matchbox xinit xdotool unclutter git apache2 php5 libapache2-mod-php5 -y
rm /var/www/html/index.html
git clone https://github.com/mehlbox/DieUhr.git /var/www/html/
cd /var/www/html
echo "{}" > data.json
chmod 777 data.json
xinit ./startMidori.sh
```
- add ```xinit /var/www/html/startMidori.sh``` to ```/etc/rc.local``` for autostart
- control your display by calling http://raspberrypi on your smartphone

## advanced
- Use any single board computer with HDMI out.
- Install a webserver with php capabilities on a system you prefer.
- git clone to your webservers root folder.
- set up yor single board computer to run a browser in fullscreen and point it to http://[webserver]/display.html
- CSS files are optimized for a 16:9 ratio.
- control your display by calling http://[webserver] on your smartphone
- You can have more than one display board calling the same page from the webserver. It is actually less expensive to use couple raspberry pi's instead some hdmi matrix with converter for long wiring. 



