var express = require('express')
var router = express.Router()
var devs = require("./api/devs")
var pool = require("../agentpool")
var ports = require("./api/ports")
ports.initOddPort(8507, 8509)

router.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "X-Requested-With")
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8")
    next()
});

router.get('/devs',function(req, res){
    res.json(devs.getlist())
});

router.get('/dev/:SN',function(req, res){
    var dev = devs.getdev(req.params.SN)
    res.json(dev)
})

router.get('/dev/lport/:SN',function(req, res) {
    var dev = devs.getdev(req.params.SN) 
    if(dev != null){
        res.json(dev.LPORT)
    } else {
        res.json(null)
    }
})

router.post('/ssh/:SN', function(req, res) {
    var ag = pool.getbySN(req.params.SN)
    if(ag != null) {
        ag.sendcmd(1)
    }
})

router.get('/dev/link/:SN',function(req, res) {
    var dev = devs.getdev(req.params.SN) 
    if(dev != null){
        res.json(dev.LINK)
    } else {
        res.json(null)
    }
})

router.post('/closessh/:SN', function(req, res) {
     var ag = pool.getbySN(req.params.SN)
    if(ag != null) {
        ag.sendcmd(0)
    }
})

router.get('/today/:SN',function(req, res){
    var sn = req.params.SN
    var day = new Date()
    var time = {
        'sn': sn,
        'start' : day.setHours(0),
        'end' : day.setDate(day.getDate()+1)
    }
    var infos = db.getinfo(time)
    res.json(infos)
})

router.all('')

module.exports = router;
