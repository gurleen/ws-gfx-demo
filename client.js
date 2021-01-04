const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

var dataMessage = {
  "type": "data",
  "body": {
    "key": "homeScore",
    "value": 10
  }
}

var controlMessage = {
  "type": "control",
  "body": {
    "graphic": "scorebug",
    "action": "toggle"
  }
}

var requestMessage = {
  "type": "request",
  "body": {
    "key": "homeScore"
  }
}

ws.on('open', function open() {
  ws.send(JSON.stringify(dataMessage));
  ws.send(JSON.stringify(controlMessage));
  ws.send(JSON.stringify(requestMessage));
});

ws.on('message', function incoming(data) {
  console.log(data);
});