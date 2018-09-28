/* eslint-disable */
// devlistsock.js

// private
var pool = require('./agentpool')
var sshsocket = require('./sshsock')
var devsocket = require('./devsock')
var sshsession = require('./webssh/sshsession.js')

// public
module.exports = webagent

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

webagent.prototype.pushdevs = function () {
  this.socket.emit('dev_listdev', devs.getlist())
}
webagent.prototype.pushinfo = function (info) {
  if (this.devsock.sendAble()) {
    this.socket.emit('dev_listinfo', info)
  }
}

function webagent (socket) {
  this.agent_id = pool.add(this)
  this.socket = socket
  this.type = 'webagent'

  // if websocket connection arrives without an express session, kill it
  if (!socket.request) {
    socket.emit('401 UNAUTHORIZED')
    socket.disconnect(true)
    return
  }

  this.devsock = new devsocket(socket)
  // regiseter ssh
  socket.on('sshready', (data) => {
    sshsession.save(socket, data)
    this.sshsock = new sshsocket(socket)
  })

  socket.on('disconnect', function socketOnDisconnect (reason) {
    socket.emit('sshagent_disconnect')
    socket.emit('dev_disconnect')
  })

  socket.on('error', function socketOnError (err) {
    socket.emit('sshagent_error')
    socket.emit('dev_error')
    this.destroy()
    console.log(err)
  })

  socket.on('end', function socketOnError (err) {
    socket.emit('sshagent_end')
    socket.emit('dev_end')
    this.destroy()
    console.log(err)
  })
}
