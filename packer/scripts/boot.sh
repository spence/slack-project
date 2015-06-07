#!/usr/bin/env bash

# Wait for instance to be ready
sleep 30

sudo apt-get update

# Install mysql
export DEBIAN_FRONTEND=noninteractive
sudo apt-get install debconf-utils
echo "mysql-server mysql-server/root_password password root" | sudo debconf-set-selections
echo "mysql-server mysql-server/root_password_again password root" | sudo debconf-set-selections
sudo apt-get install -y mysql-server
sudo apt-get install mysql-client

# Setup mysql db and user
mysql -uroot -proot -e "CREATE DATABASE slack; GRANT ALL PRIVILEGES ON slack.* TO slackuser@localhost WITH GRANT OPTION; SET PASSWORD FOR slackuser@localhost = PASSWORD('Y4LU3ZxdMD8aL'); FLUSH PRIVILEGES;"

# Install nginx
sudo apt-get install -y nginx

# Install app runtime dependencies 
sudo apt-get install -y python-pip
sudo apt-get install -y libmysqlclient-dev
sudo apt-get install -y python-dev
sudo pip install virtualenv
