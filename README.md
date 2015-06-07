
# AWS

Build AWS AMI
```bash

# Build app
gulp release

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

Launch image via AWS console. There is no SSL termination deployed here. ELB takes care of that.

# Running locally (Mac OSX 10.10)

```bash
# Install dependencies
brew install node mysql nginx
pip install virtualenv
virtualenv --python=/usr/bin/python2.7 .virtualenv
source .virtualenv/bin/activate
pip install -r requirements.txt
npm install

# Setup mysql db
sudo mysql -e "CREATE DATABASE slack; GRANT ALL PRIVILEGES ON slack.* TO slackuser@localhost WITH GRANT OPTION; SET PASSWORD FOR slackuser@localhost = PASSWORD('Y4LU3ZxdMD8aL'); FLUSH PRIVILEGES;"

# Setup www folder
sudo mkdir -p /usr/share/nginx/www/
sudo ln -s $PWD /usr/share/nginx/www/slack-project
sudo chmod 755 /usr/share/nginx/www/slack-project

# Start nginx
sudo mkdir -p /var/log/nginx/
sudo nginx -s stop
sudo nginx -c /usr/share/nginx/www/slack-project/nginx.osx.conf

# Start gunicorn
./run.osx.sh

# Add host entry
sudo -- sh -c "echo \"127.0.0.0 slack.projects.spencercreasey.com\" >> /etc/hosts"

# Lastly, open browser to https://slack.projects.spencercreasey.com
```

# Using real cert (ignore)
```bash
# Map secrets to path
rm -rf certificates
rm -rf env.sh
ln -s ../certificates certificates
ln -s ../env.sh env.sh
```
