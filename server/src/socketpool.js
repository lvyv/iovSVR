var aglib = require("./iovagent")

var agents = []


module.exports.add = function (socket) {
    socket.setEncoding('utf8')
    var agent = new aglib(socket)
    agents.push(agent) 
    socket.on('data', (data) => {

    })


}