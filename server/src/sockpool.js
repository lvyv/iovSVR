var agents = []

module.exports.add = function (agent) {
    for(var i in agents) {
        if(sock[i] == agent)
        {
            return i
        }
    }
    agents.push(agent)
    return (agents.length - 1)
}

module.exports.del = function (agent) {
    for(var i in agents){
        if (agents[i] == agent)
        {
            agents.splice(i,1)
        }
    }
    return
}

module.exports.get = function (idx) {
    if(idx >= agents.length)
    {
        return null
    }
    return agents[idx]
}