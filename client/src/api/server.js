const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')

let app = require('express')()
let httpSvr = require('http').Server(app)
let io = require('socket.io')(httpSvr)
const MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/'

function answerCli (sock) {
  console.log('emit mapagent_title msg')
  sock.emit('mapagent_title', 'ABCDEFG@@@')
  setTimeout(function () {
    answerCli(sock)
  }, 1000)
}
io.on('connection', function (socket) {
  console.log('a user connected')
  setTimeout(function () {
    answerCli(socket)
  }, 1000)
  socket.on('backend.map', function (data) {
    console.log('data received from client', data)
  })
})

var dbo
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err
  dbo = db.db('sensor_data')
})

// const OktaJwtVerifier = require('@okta/jwt-verifier')

// const oktaJwtVerifier = new OktaJwtVerifier({
//   clientId: '0oafqsxibdgDcvs4N0h7',
//   issuer: 'https://dev-267981.oktapreview.com/oauth2/default'
// })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/mongodb/sensor_data/s_data/:ids/:sTime/:eTime', function (req, res) {
  var id = req.params.ids.split(',').map(Number)
  var sTime = req.params.sTime.replace(' ', 'T') + 'Z'
  var eTime = req.params.eTime.replace(' ', 'T') + 'Z'
  var condition = { 'sensorid': { $in: id }, 'time': { $gte: new Date(sTime), $lte: new Date(eTime) } }
  dbo.collection('s_data').find(condition).toArray(function (err, result) { // 返回集合中所有数据
    try {
      if (err) { throw err }
    } catch (error) {
      console.log(error)
    }
    console.log(result)
    res.json(result)
  })
})

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  // oktaJwtVerifier.verifyAccessToken(accessToken)
  //   .then(jwt => {
  //     req.user = {
  //       uid: jwt.claims.uid,
  //       email: jwt.claims.sub
  //     }
  //     next()
  //   })
  //   .catch(next) // jwt did not verify!
  console.log(accessToken)
  next()
})

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite'
  // operatorsAliases: false
})

// Define our Trip model
// id, createdAt, and updatedAt are added by sequelize automatically
let Trip = database.define('trips', {
  car: Sequelize.STRING,
  data: Sequelize.TEXT
})

// let bridge = database.define('bridges', {
//   briid: Sequelize.INTEGER, // bridge id
//   addr: Sequelize.TEXT, // bridge address
//   mod: Sequelize.TEXT,
//   memo: Sequelize.TEXT // bridge reserve
// })

let Devinfo = database.define('dev_infos', {
  devid: Sequelize.INTEGER, // device id
  sn: Sequelize.STRING, // device sn
  version: Sequelize.STRING, // device version
  briid: Sequelize.INTEGER // bridge id
})

let Sensorcfg = database.define('sensor_cfgs', {
  type: Sequelize.INTEGER,
  name: Sequelize.TEXT,
  range: Sequelize.INTEGER,
  unit: Sequelize.TEXT
})

let Sensors = database.define('sensors', {
  sensorid: Sequelize.STRING, // sensor id
  sensorfac: Sequelize.TEXT, // sensor factory
  sensortype: Sequelize.INTEGER, // sensor type
  devid: Sequelize.INTEGER, // device id
  chid: Sequelize.INTEGER, // channel id
  position: Sequelize.TEXT // sensor position
})

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Trip model
// let userResource = epilogue.resource({
epilogue.resource({
  model: Trip,
  endpoints: ['/trips', '/trips/:id'],
  search: {
    operator: '$gt',
    attributes: [ 'id' ]
  }
})

epilogue.resource({
  model: Devinfo,
  endpoints: ['/dev_infos', '/dev_infos/:id'],
  search: {
    operator: '$gt',
    attributes: [ 'id' ]
  }
})

epilogue.resource({
  model: Sensorcfg,
  endpoints: ['/sensor_cfgs', '/sensor_cfgs/:id'],
  search: {
    operator: '$gt',
    attributes: [ 'id' ]
  }
})

epilogue.resource({
  model: Sensors,
  endpoints: ['/sensors', '/sensors/:devid'],
  search: {
    operator: '$eq',
    attributes: [ 'devid' ]
  }
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: false })
  .then(function () {
    httpSvr.listen(3000, function () {
      console.log('listening at http://%s:%d', 'localhost', httpSvr.address().port)
    })
  })
