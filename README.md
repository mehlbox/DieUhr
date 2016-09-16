# DieUhr
- Use RASPBIAN JESSIE LITE from https://www.raspberrypi.org/downloads/raspbian/

## how to install:
```bash
sudo su
apt-get update && apt-get upgrade -y
apt-get install midori matchbox xinit xdotool unclutter apache2 php5 libapache2-mod-php5 git -y
rm /var/www/html/index.html
git clone https://github.com/mehlbox/DieUhr.git /var/www/html/
cd /var/www/html
mkdir data
cd date
touch message.txt mode.inf preview.inf status.inf wedding.txt
chmod 777 *
```
Optional:
- add run.sh to /etc/rc.local for autostart
- have fun
