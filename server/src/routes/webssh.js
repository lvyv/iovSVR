var path = require('path')
var config = require('read-config')(path.join(__dirname, '/webssh/webssh.json'))
var express = require('express')
var router = express.Router();
var myutil = require('./webssh/util')
var validator = require('validator')


router.all('/',function(req,res,next) {
  res.send("resuest dev id!");
  console.log("reqeust dev id !");
})

router.all('/host',function(req,res,next) {
  res.send("resuest dev id!");
  console.log("reqeust dev id !");
})


router.all('/host/:host?', function (req, res, next) {
  //res.sendFile(path.join(path.join(__dirname, '../../dist/', 'webssh.html')))
  // capture, assign, and validated variables
  req.session.ssh = {
    host: (validator.isIP(req.params.host + '') && req.params.host) ||
      (validator.isFQDN(req.params.host) && req.params.host) ||
      (/^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test(req.params.host) &&
      req.params.host) || config.ssh.host,
    port: (validator.isInt(req.query.port + '', {min: 1, max: 65535}) &&
      req.query.port) || config.ssh.port,
    header: {
      name: req.query.header || config.header.text,
      background: req.query.headerBackground || config.header.background
    },
    algorithms: config.algorithms,
    keepaliveInterval: config.ssh.keepaliveInterval,
    keepaliveCountMax: config.ssh.keepaliveCountMax,
    term: (/^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test(req.query.sshterm) &&
      req.query.sshterm) || config.ssh.term,
    terminal: {
      cursorBlink: (validator.isBoolean(req.query.cursorBlink + '') ? myutil.parseBool(req.query.cursorBlink) : config.terminal.cursorBlink),
      scrollback: (validator.isInt(req.query.scrollback + '', {min: 1, max: 200000}) && req.query.scrollback) ? req.query.scrollback : config.terminal.scrollback,
      tabStopWidth: (validator.isInt(req.query.tabStopWidth + '', {min: 1, max: 100}) && req.query.tabStopWidth) ? req.query.tabStopWidth : config.terminal.tabStopWidth
    },
    allowreplay: (validator.isBoolean(req.headers.allowreplay + '') ? myutil.parseBool(req.headers.allowreplay) : false),
    mrhsession: ((validator.isAlphanumeric(req.headers.mrhsession + '') && req.headers.mrhsession) ? req.headers.mrhsession : 'none'),
    serverlog: {
      client: config.serverlog.client || false,
      server: config.serverlog.server || false
    },
    readyTimeout: (validator.isInt(req.query.readyTimeout + '', {min: 1, max: 300000}) &&
      req.query.readyTimeout) || config.ssh.readyTimeout
  }
  if (req.session.ssh.header.name) validator.escape(req.session.ssh.header.name)
  if (req.session.ssh.header.background) validator.escape(req.session.ssh.header.background)
})


module.exports = router;
