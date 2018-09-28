var path = require('path')
var config = require('read-config')(path.join(__dirname, 'webssh.json'))
var myutil = require('./util')
var validator = require('validator')

module.exports.save = function (req, data){
  //res.sendFile(path.join(path.join(__dirname, '../../dist/', 'webssh.html')))
  // capture, assign, and validated variables
  req.session.ssh = {
    host: (validator.isIP(data.host + '') && data.host) ||
      (validator.isFQDN(data.host) && data.host) ||
      (/^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test(data.host) &&
      data.host) || config.ssh.host,
    port: (validator.isInt(data.port + '', {min: 1, max: 65535}) &&
      data.port) || config.ssh.port,
    header: {
      name: data.header || config.header.text,
      background: data.headerBackground || config.header.background
    },
    algorithms: config.algorithms,
    keepaliveInterval: config.ssh.keepaliveInterval,
    keepaliveCountMax: config.ssh.keepaliveCountMax,
    term: (/^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test(data.sshterm) &&
      data.sshterm) || config.ssh.term,
    terminal: {
      cursorBlink: (validator.isBoolean(data.cursorBlink + '') ? myutil.parseBool(data.cursorBlink) : config.terminal.cursorBlink),
      scrollback: (validator.isInt(data.scrollback + '', {min: 1, max: 200000}) && data.scrollback) ? data.scrollback : config.terminal.scrollback,
      tabStopWidth: (validator.isInt(data.tabStopWidth + '', {min: 1, max: 100}) && data.tabStopWidth) ? data.tabStopWidth : config.terminal.tabStopWidth
    },
    allowreplay: (validator.isBoolean(req.headers.allowreplay + '') ? myutil.parseBool(req.headers.allowreplay) : false),
    mrhsession: ((validator.isAlphanumeric(req.headers.mrhsession + '') && req.headers.mrhsession) ? req.headers.mrhsession : 'none'),
    serverlog: {
      client: config.serverlog.client || false,
      server: config.serverlog.server || false
    },
    readyTimeout: (validator.isInt(data.readyTimeout + '', {min: 1, max: 300000}) &&
      data.readyTimeout) || config.ssh.readyTimeout
  }
  if (req.session.ssh.header.name) validator.escape(req.session.ssh.header.name)
  if (req.session.ssh.header.background) validator.escape(req.session.ssh.header.background)
}
