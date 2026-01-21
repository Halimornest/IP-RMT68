require('dotenv').config()

const express = require('express')
const cors = require('cors')

// load associations sekali
require('./models/associations')

const routes = require('./routes/index') // ⬅️ PENTING
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.use('/api', routes)

app.use(errorMiddleware)

module.exports = app
