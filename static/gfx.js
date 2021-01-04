const socket = new WebSocket('ws://localhost:8080')
window.Spruce.store('gfx', {
    boxTitle: ''
})

const initMessage = {
    "type": "request",
    "body": {
        "key": "$all"
    }
}
socket.onopen = (_) => socket.send(JSON.stringify(initMessage))
socket.onmessage = (e) => {
    var msg = JSON.parse(e.data)
    console.log(msg)
    if(msg.type == "all" ) {
        for(var key in msg.body) {
            window.Spruce.store('gfx')[key] = msg.body[key]
        }
    }
    else if(msg.type == "data") {
        console.log(msg.body)
        window.Spruce.store('gfx')[msg.body.key] = msg.body.value
    }
}