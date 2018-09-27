// devsock.js

// private
var pool = require('./agentpool')

// public
module.exports = devsock
function devsock(socket) {
    this.infoflg = 0

    socket.on('dev_info', function socketOnInfo(params) {
        this.infoflg = 1
    })
    socket.on('dev_list', function socketOnDev() {
        // let list = devs.getlist()
        // send list
        var list = [{
            SN:'E529TESTSERSN',
            NO:'E529TESTSERNO',
            ONLINE:1,
            LINK:1,
            LPORT:50
        }]
        socket.emit('dev_listdev',list)
    })

    socket.on('dev_link', function socketOnLink(sn) {
        var ag = pool.getbySN(sn)
        if(ag != null){
            ag.sendcmd(1)
        }   
    })

    socket.on('dev_cutlink', function socketOnCutlink(sn) { 
        var ag = pool.getbySN(sn)
        if(ag != null){
            ag.unlink()
        }
        console.log(reason)
     })

 
    socket.on('dev_disconnect', function socketOnDisconnect (reason) {
      console.log('SOCKET DISCONNECT: ' + reason)
    })
    socket.on('dev_error', function socketOnError (err) {
      console.log(err)
    })
    socket.on('dev_end', function socketOnError (err) {
      console.log(err)
    })
}

devsock.prototype.sendAble = function () {
    return this.infoflg
}