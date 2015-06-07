
# Chat Application (UI ripped from Slack)

## Running locally (Mac OSX 10.10)

```bash
# Grab contents
git clone https://github.com/spence/slack-project.git
cd slack-project

# Setup python env
pip install virtualenv
virtualenv --python=/usr/bin/python2.7 .virtualenv
source .virtualenv/bin/activate
pip install -r requirements.txt

# Build react frontend
brew install node
npm install
gulp release # Use `gulp` for dev w/ watcher

# Install mysql and init db & user
brew install mysql
source env.sh # Grab creds that app will use
sudo mysql -e "CREATE DATABASE slack; GRANT ALL PRIVILEGES ON slack.* TO $MYSQL_USER@localhost WITH GRANT OPTION; SET PASSWORD FOR $MYSQL_USER@localhost = PASSWORD('$MYSQL_PASS'); FLUSH PRIVILEGES;"

# Setup NGINX
brew install nginx
sudo mkdir -p /usr/share/nginx/www/ /var/log/nginx/
sudo ln -s $PWD /usr/share/nginx/www/slack-project
sudo chmod 755 /usr/share/nginx/www/slack-project
sudo nginx -s stop
sudo nginx -c /usr/share/nginx/www/slack-project/nginx.osx.conf

# Start gunicorn
./run.osx.sh

# Add host entry
sudo -- sh -c "echo \"127.0.0.0 localhost.dev\" >> /etc/hosts"

# Open dev site (note: https://localhost will not work)
open 'https://localhost.dev'
```

## AWS

Build AWS AMI
```bash

# Build app
gulp release

# Map secrets to path
rm -rf certificates
rm -rf env.sh
ln -s ../certificates certificates
ln -s ../env.sh env.sh

# Tar workspace
(cd .. &&
 COPYFILE_DISABLE=1 tar czfh app.tar.gz \
    --exclude=slack-project/node_modules --exclude=slack-project/packer/artifacts \
    --exclude=slack-project/src --exclude=slack-project/.* --exclude=slack-project/**/.* \
    --exclude=slack-project/.pyc --exclude=slack-project/**/.pyc \
    slack-project &&
 cp app.tar.gz slack-project/packer/artifacts/app.tar.gz)

# Build AMI
# (credential setup via http://docs.aws.amazon.com/cli/latest/reference/configure/index.html)
(cd packer && packer build -var "aws_access_key=$(aws configure get aws_access_key_id)" -var "aws_secret_key=$(aws configure get me.aws_secret_access_key)" ubuntu.json)
```

Launch image via AWS console. ELB doesn't support websockets, so if we want SSL we need to terminate in app.
