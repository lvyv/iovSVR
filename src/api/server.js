const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')

let app = require('express')()
let httpSvr = require('http').Server(app)
let io = require('socket.io')(httpSvr)

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
// const OktaJwtVerifier = require('@okta/jwt-verifier')

// const oktaJwtVerifier = new OktaJwtVerifier({
//   clientId: '0oafqsxibdgDcvs4N0h7',
//   issuer: 'https://dev-267981.oktapreview.com/oauth2/default'
// })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Trip model
// let userResource = epilogue.resource({
epilogue.resource({
  model: Trip,
  endpoints: ['/trips', '/trips/:id']
  // search: {
  //   operator: '$gt',
  //   attributes: [ 'id' ]
  // }
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: false })
  .then(function () {
    httpSvr.listen(3000, function () {
      console.log('listening at http://192.168.1.216:%d', httpSvr.address().port)
    })
  })
