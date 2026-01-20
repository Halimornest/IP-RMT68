require('dotenv').config()

const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.get('/ping', (req, res) => {
  res.send('pong')
})
app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.use(errorMiddleware)

module.exports = app
