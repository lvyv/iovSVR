var agents = []

module.exports.add = function (agent) {
    for(var i in agents) {
        if(agents[i] == agent)
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

module.exports.get = function (agent_id) {
    for(var ag of agents)
    {
        if(ag.agent_id == agent_id)
        {
            return ag
        }
    }
    return null
}

module.exports.getall = function (type) {
    var output = []
    for(var ag of agents)
    {
        if(ag.type == type)
        {
            output.push(ag)
        }
    }
    return output
}

module.exports.getbySN = function (sn) {
    for(var ag of agents)
    {
        if(ag.type == 'iovagent') 
        {
            if(ag.dev.SN == sn)
            {
                return ag
            }
        }
    }
    return null
}

