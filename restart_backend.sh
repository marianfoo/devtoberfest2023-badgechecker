sudo kill -9 $(sudo lsof -t -i:3000)
nohup npm run start:server < /dev/null > output.log 2>&1 &