const fs = require('fs')
const http = require('http')
const WebSocket = require('ws')

const wss = new WebSocket.Server({port: 8080})
var store = {
    data: {
        boxTitle: 'hello'
    },
    graphics: {}
}

function broadcast(message) {
    wss.clients.forEach((client) => {
        if(client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify(message))
        }
    })
}

function handleDataMessage(msg, _) {
    store.data[msg.key] = msg.value
    var newMsg = {
        type: "data",
        body: msg
    }
    broadcast(newMsg)
}

function handleControlMessage(msg, _) {
    switch(msg.action) {
        case "toggle":
            store.graphics[msg.graphic] = !store.graphics[msg.graphic]
            break
        case "show":
            store.graphics[msg.graphic] = true
            break
        case "hide":
            store.graphics[msg.graphic] = false
    }
    broadcast({
        graphic: msg.graphic,
        state: store.graphics[msg.graphic]
    })
}

function handleRequestMessage(msg, conn) {
    if(msg.key == "$all") {
        var message = {
            type: 'all',
            body: store.data
        }
        conn.send(JSON.stringify(message))
        return
    }
    var message = {
        key: msg.key,
        value: store.data[msg.key]
    }
    conn.send(JSON.stringify(message))
}

const handlers = {
    "data": handleDataMessage,
    "control": handleControlMessage,
    "request": handleRequestMessage
}

function handleMessage(conn, message) {
    var parsed = JSON.parse(message)
    var handler = handlers[parsed.type]
    console.log(parsed)
    handler(parsed.body, conn)    
}

wss.on('connection', (ws) => {
    ws.on('message', (msg) => handleMessage(ws, msg))
})

var server = http.createServer((req, res) => {
    fs.readFile(__dirname + "/static/" + req.url, (err, data) => {
        if(err) {
            res.writeHead(404)
            res.end(JSON.stringify(err))
            return
        }
        res.writeHead(200)
        res.end(data)
    })
}).listen(8081)

console.log('running server on port 8080')