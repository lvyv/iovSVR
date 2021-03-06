/* eslint-disable */
var createError = require('http-errors')
var path = require('path')
var config = require('read-config')(path.join(__dirname, '/webssh/webssh.json'))
var express = require('express')
var cookieParser = require('cookie-parser')
var myutil = require('./webssh/util')
var logger = require('morgan')
var session = require('express-session')({
  resave: false,
  saveUninitialized: true,
  secret: config.session.secret,
  name: config.session.name,
  unset: 'destroy'
})
var compression = require('compression')
var history = require('connect-history-api-fallback')
// var expressOptions = require('./expressOptions')

var indexRouter = require('./routes/index')
var apiRouter = require('./routes/api')
// var websshRouter=require('./routes/webssh');

var app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// cors config

app.use(history())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// static files
app.use(express.static(path.join(__dirname, '../../public')))

// express
app.use(compression({ level: 9 }))
app.use(session)
if (config.accesslog) app.use(logger('common'))
app.disable('x-powered-by')

app.use('/', indexRouter)
app.use('/api', apiRouter)
// app.use(myutil.basicAuth)
// app.use('/webssh', websshRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

var webagent = require('./webagent')
var server = require('http').Server(app)
var io = require('socket.io')(server, { serveClient: false })

// socket.io
// expose express session with socket.request.session
io.use(function (socket, next) {
  (socket.request.res) ? session(socket.request, socket.request.res, next)
    : next(next)
})

// bring up socket

io.on('connection', function (socket) {
  var ag = new webagent(socket)
  // do something for ag
})

module.exports = server
