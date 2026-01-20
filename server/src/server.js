const app = require('./app')
const { sequelize } = require('./config/database')

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    await sequelize.sync({ alter: true })

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('DB connection failed:', error)
    process.exit(1)
  }
}

startServer()
