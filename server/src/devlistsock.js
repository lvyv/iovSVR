// devlistsock.js

// private
var devs = require('./routes/api/devs')
var pool = require('./sockpool')
var ports = require("./routes/api/ports")

// public
module.exports = devlistsock
function devlistsock (socket) {
    // if websocket connection arrives without an express session, kill it
    if (!socket.request) {
      socket.emit('401 UNAUTHORIZED')
      socket.disconnect(true)
      return
    }
    socket.on('list', function socketOnList() {
        console.log('get ws list');
        var list = devs.getlist()
        //send list
        socket.emit('devlist',list)
    })
    socket.on('link', function socketOnLink(sn) {
        var dev = devs.getdev(req.params.SN)
        for (var ag of pool.agents) {
            var curDev = ag.getdev()
            if(curDev.SN == dev.SN){
                if(curDev.LPORT == 0) {
                    var lport = ports.getport()
                    ag.sendcmd(lport)
                } else {
                    console.log('duplicated port!')
                }
            }
        }   
    })
    socket.on('cutlink', function socketOnCutlink(sn) { 
        var dev = devs.getdev(req.params.SN)
        for (var ag of agents) {
            var curDev = ag.getdev()
            if(curDev.SN == dev.SN){
                //cut dev ssh link
                //ag.sendcmd()
                ports.rollBack(dev.LPORT)
            }
        }   
        console.log(reason)
     })
    socket.on('disconnect', function socketOnDisconnect (reason) {
      console.log('SOCKET DISCONNECT: ' + reason)
    })
    socket.on('error', function socketOnError (err) {
        console.log(err)
    })
}

devlistsock.prototype.emit = function (tag , data) {
    this.socket.emit(tag, data)
}

