# DieUhr
- Use RASPBIAN JESSIE LITE from https://www.raspberrypi.org/downloads/raspbian/

## how to install:
```bash
sudo apt-get update && apt-get upgrade -y
sudo apt-get install midori matchbox xinit xdotool unclutter apache2 php5 libapache2-mod-php5 git -y
rm /var/www/html/index.html
git clone https://github.com/mehlbox/DieUhr.git /var/www/html/
/var/www/html/install.sh
```
Optional:
- add run.sh to /etc/rc.local for autostart
- have fun
