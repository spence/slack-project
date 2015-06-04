Build packer image:
```bash
# using credentials setup via http://docs.aws.amazon.com/cli/latest/reference/configure/index.html
packer build -var "aws_access_key=$(aws configure get me.aws_access_key_id)" -var "aws_secret_key=$(aws configure get me.aws_secret_access_key)" ubuntu.json
```

Run python server
```bash
./run.py
```

Running nginx locally
```bash
# Start
sudo nginx -c $PWD/nginx.osx.conf
# Stop
sudo nginx -s stop
```

Setup react app dependancies
```
npm install
```

Setup nginx locations
```bash

# Setup base nginx location
sudo ln -s $PWD /slack-project-www
sudo chown www:www /slack-project-www

# Map SSL cert dir
ln -s ../ssl-certificates certificates
```
