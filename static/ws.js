const socket = new WebSocket('ws://localhost:8080')

sendData = (key, value) => socket.send(JSON.stringify({type: "data", body: {key: key, value: value}}))

socket.onmessage = console.log