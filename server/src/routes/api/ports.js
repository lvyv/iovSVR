
var oddPort=[]
var usedPort=[]

function initOddPort (Min, Max) {
    for(var j = Min; j <= Max; j++) {
        oddPort.push(j)
    }
}


function getport() {
    if(oddPort == false)
        return 0
    var port = oddPort.pop()
    usedPort.push(port)
    return port
}

function rollBack(port) {
    if(port == 0)
        return

    var index = usedPort.indexOf(port)

    if(index >= 0) {
        usedPort.splice(index, 1)
        oddPort.push(port)
    }
}

function usePort(port) {
    if(port == 0)
        return
        
    var index = oddPort.indexOf(port)

    if(index >= 0) {
        oddPort.splice(index, 1)
        usedPort.push(port)
    }
}

module.exports.initOddPort = initOddPort
module.exports.getport = getport
module.exports.rollBack = rollBack
module.exports.usePort = usePort



