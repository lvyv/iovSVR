var ports = require("./routes/api/ports")
var devs = require('./routes/api/devs')
var db = require('./routes/api/db')
var pool = require('./agentpool')


module.exports = iovagent

var ERR_CODE = {
    0:"REMOTE_CTL_OPEN_OR_CLOSE_SUCCEED",
    1:"REMOTE_CLT_CONTROL_PARAM_ERR",
    2:"REMOTE_CTL_OPEN_ALREADY_RUN_ERR",
    3:"REMOTE_CTL_OPEN_TIMEOUT_ERR",
    4:"REMOTE_CTL_OPEN_NET_CONNECT_ERR",
    5:"REMOTE_CTL_OPEN_REMOTE_PORT_USED_ERR",
    6:"REMOTE_CTL_OPEN_OTHER_ERR",
    7:"REMOTE_CTL_CLOSE_CONNECT_NONEXIST",
    8:"REMOTE_CTL_CLOSE_OTHER_ERR"
}

function splitTcpPack(data) {
    var arr = new Array()
    if(data.indexOf('}{') == -1) {
        arr[0] = data
    } else {
        arr = data.split("}{")
        for (var i in arr) {
            if(i == 0) {
                arr[i] += '}'
            } else if(i == arr.length - 1) {
                arr[i] = '{' + arr[i]
            } else {
                arr[i] = '{' + arr[i] +'}'
            }
        }
    }
    
    return arr
}


iovagent.prototype.updatestamp = function () {
    this.laststamp = Date.now()
}

iovagent.prototype.heartbeat = function (data) {
    this.socket.write(data)
    this.seq++
    return
}

iovagent.prototype.newdev = function(data) {
    this.dev.SN = data.sn
    this.dev.ONLINE = 1
    this.dev.LINK = 0
    devs.add(this.dev)
    return 
}

iovagent.prototype.updatedev = function (data) {
    if(data.msg.stat == 1 && data.msg.port != 0) {
        this.dev.SN = data.sn
        this.dev.LINK = 1
        this.dev.LPORT = data.msg.port
        ports.usePort(data.msg.port)
        devs.change(this.dev)
    }
    return 
}

iovagent.prototype.unlink = function (data) {
        ports.rollBack(this.dev.LPORT)
        this.dev.LINK = 0
        this.dev.LPORT =  0
        devs.change(this.dev)
}

iovagent.prototype.hasdev = function(data) {
    if(this.dev.SN == data.sn) {
        return 1;
    } else {
        return 0;
    }
}

iovagent.prototype.sendcmd = function (ctl) {
    if(this.dev.LPORT != null)
    {
        console.log('duplicated port!')
        return 
    }else{
        var port = ports.getport()
        this.dev.LPORT = port
        this.cmd.sn = this.dev.SN
        this.cmd.msg.ctl = ctl 
        this.cmd.msg.r_port =  port
        this.cmd.msg.r_addr = "192.168.100.84"
        this.cmd.msg.t = this.seq++
        this.socket.write(JSON.stringify(this.cmd))
        //not change devs because is not finished
    }
   return 
}

iovagent.prototype.finishconn = function (data) {
    if(data.sn == this.cmd.sn
    &&data.msg.ctl == this.cmd.msg.ctl
    &&data.msg.t == this.cmd.msg.t) {
        this.dev.ONLINE = 1
        if(data.msg.ctl == 1) {
            if(ERR_CODE[data.msg.ack] == "REMOTE_CTL_OPEN_OR_CLOSE_SUCCEED" 
            || ERR_CODE[data.msg.ack] == "REMOTE_CTL_OPEN_ALREADY_RUN_ERR") {
                this.dev.LINK = 1
                devs.change(this.dev)
            } else {
                //this.dev.LPORT = 0
            }

            if(ERR_CODE[data.msg.ack] != "REMOTE_CTL_OPEN_OR_CLOSE_SUCCEED") { 
                if(ERR_CODE[data.msg.ack] != "REMOTE_CTL_OPEN_ALREADY_RUN_ERR" 
                && ERR_CODE[data.msg.ack] != "REMOTE_CTL_OPEN_REMOTE_PORT_USED_ERR") {
                    ports.rollBack(this.dev.LPORT)
                    this.dev.LPORT = null
                }
            }

        } else {
            if(ERR_CODE[data.msg.ack] == "REMOTE_CTL_OPEN_OR_CLOSE_SUCCEED" 
            || ERR_CODE[data.msg.ack] == "REMOTE_CTL_CLOSE_CONNECT_NONEXIST") {
                this.dev.LINK = 0
                ports.rollBack(this.dev.LPORT)
                this.dev.LPORT = null
                devs.change(this.dev)
            }
        }
    }
    return 
}

iovagent.prototype.getsocket = function () {
    return this.socket
}

iovagent.prototype.getdev = function () {
    return this.dev
}

iovagent.prototype.destroy = function () {
    pool.del(this)
    devs.del(this.dev.SN)
    ports.rollBack(this.dev.LPORT)
    this.cmd = {}
    this.dev = {}
    return
}


iovagent.prototype.check = function () {
    if(this.laststamp == 0) {
        this.laststamp = Date.now()
        return
    }
    var diffstamp = Date.now() - this.laststamp
    if(diffstamp  <= 30000) {
        return 0
    } else if (diffstamp  <= 60000) {
        this.dev.ONLINE = 0
        this.dev.LINK = 0
        devs.change(this.dev)
    } else {
        this.destroy()
    } 
}


function iovagent(socket)
{
    this.agent_id = pool.add(this);
    this.socket = socket
    this.type = 'iovagent'

    this.laststamp = Date.now()
    this.seq = 0 
    this.cmd = {
        "cmd":1,
        "sn": null,
        "msg": {
            "ctl":1,
            "l_port":22,
            "r_port": null,
            "l_addr":"127.0.0.1",
            "r_addr": null,
            "t": 0,
        }
    }
    this.dev = {
        'SN' : null,
        'NUM' : null,
        'ONLINE' : 0,
        'LINK' : 0,
        'LPORT' : null,
    }

    //add data func
    this.socket.on('data',(data)=> {
        var packs = splitTcpPack(data)
        for (var pack of packs){
            var dat=JSON.parse(pack)
            this.updatestamp()
            switch(dat.cmd) {
                case 0:
                    this.heartbeat(data)
                    if(!this.hasdev(dat)) {
                        this.newdev(dat)
                    }
                break
                case 1:
                    this.finishconn(dat)
                    var ags = pool.getall('webagent')
                    for(var ag of ags)
                    {
                        ag.pushdevs()
                    }
                break
                case 2:
                    if(!this.hasdev(dat)) {
                        this.newdev(dat)
                    }
                    this.updatedev(dat)
                break
                case 17:
                    db.saveinfo(dat) 
                    var ags = pool.getall('webagent')
                    for(var ag of ags)
                    {
                        ag.pushinfo(dat)
                    }
                break
                default:
                    this.heartbeat(data)
                break
            }
        }
    })

    this.socket.on('error', (err) => {
        this.destroy() 
        return
    })

    this.socket.on('end',(data)=> {
        this.destroy()
        return
    })
}