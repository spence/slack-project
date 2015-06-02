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

```
npm install
```