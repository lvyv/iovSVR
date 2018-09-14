var net=require('net')
var iovagent= require('./iovagent')
var server = net.createServer()
var ag = null


server.on("connection", (client) => {
    client.setEncoding('utf8')
    ag = new iovagent(client)
    setInterval(() => {
        ag.check()
    },10000)
})

module.exports = server