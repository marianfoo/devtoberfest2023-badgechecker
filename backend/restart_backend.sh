sudo kill -9 $(sudo lsof -t -i:3000)
nohup npm start < /dev/null > output.log 2>&1 &