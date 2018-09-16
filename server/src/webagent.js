// devlistsock.js

// private
var devs = require('./routes/api/devs')
var pool = require('./agentpool')
var ports = require("./routes/api/ports")

// public
module.exports = webagent 
function webagent(socket) {

    this.agent_id = pool.add(this)
    this.socket = socket
    this.type = 'webagent'
    this.infoflg = 0

    // if websocket connection arrives without an express session, kill it
    if (!socket.request) {
      socket.emit('401 UNAUTHORIZED')
      socket.disconnect(true)
      return
    }
    socket.on('info', function socketOnInfo(params) {
        this.infoflg = 1
    })
    socket.on('dev', function socketOnDev() {
        let list = devs.getlist()
        //send list
        socket.emit('devlist',list)
    })

    socket.on('link', function socketOnLink(sn) {
        var ag = pool.getbySN(sn)
        if(ag != null){
            ag.sendcmd(1)
        }   
    })

    socket.on('cutlink', function socketOnCutlink(sn) { 
        var ag = pool.getbySN(sn)
        if(ag != null){
            ag.unlink()
        }
        console.log(reason)
     })

    socket.on('disconnect', function socketOnDisconnect (reason) {
      console.log('SOCKET DISCONNECT: ' + reason)
    })

    socket.on('error', function socketOnError (err) {
        this.destroy()
        console.log(err)
    })

    socket.on('end', function socketOnError (err) {
        this.destroy()
        console.log(err)
    })
}

webagent.prototype.destroy = function () {
    pool.del(this)
    this.agent_id = null
    this.socket.destroy()
    this.socket = null
    this.type = ''
}

webagent.prototype.getsocket = function () {
    return this.socket
}

webagent.prototype.pushdevs = function() {
    this.socket.emit('devlist', devs.getlist()) 
}
webagent.prototype.pushinfo = function(info) {
    if(this.infoflg == 1) {
        this.socket.emit('infolist', info) 
    }
    return
}
