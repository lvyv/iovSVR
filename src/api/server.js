const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')

// const OktaJwtVerifier = require('@okta/jwt-verifier')

// const oktaJwtVerifier = new OktaJwtVerifier({
//   clientId: '0oafqsxibdgDcvs4N0h7',
//   issuer: 'https://dev-267981.oktapreview.com/oauth2/default'
// })

let app = express()
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
  endpoints: ['/trips', '/trips/:id'],
  search: {
    operator: '$gt',
    attributes: [ 'id' ]
  }
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: false })
  .then(function () {
    app.listen(3000, function () {
      console.log('listening at http://%s:%s', 'localhost', 3000)
    })
  })
