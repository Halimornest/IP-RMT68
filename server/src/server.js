const app = require('./app')
const { sequelize } = require('./config/database')

const PORT = process.env.PORT || 3000

sequelize.authenticate()
  .then(() => {
    console.log('Database connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('DB connection failed', err)
  })
