#!/usr/bin/env bash

# Extract base www application
sudo mkdir -p /usr/share/nginx/www
sudo tar -C /usr/share/nginx/www/ -zxvf /tmp/app.tar.gz
sudo chmod 755 /usr/share/nginx/www/slack-project
sudo chown -R www-data:www-data /usr/share/nginx/www/slack-project

# Setup Flask & gunicorn
cd /usr/share/nginx/www/slack-project
sudo virtualenv .virtualenv
source .virtualenv/bin/activate
sudo pip install -r requirements.txt
sudo cp app.upstart.conf /etc/init/slack-project.conf
sudo start slack-project

# Setup nginx
sudo cp nginx.ubuntu.conf /etc/nginx/nginx.conf
sudo service nginx restart

# Pull in myself user & pass
source env.sh

# Setup mysql db and user
mysql -uroot -proot -e "CREATE DATABASE slack; GRANT ALL PRIVILEGES ON slack.* TO $MYSQL_USER@localhost WITH GRANT OPTION; SET PASSWORD FOR $MYSQL_USER@localhost = PASSWORD('$MYSQL_PASS'); FLUSH PRIVILEGES;"
