require('dotenv').config()
const { Sequelize } = require('sequelize')

const isTest = process.env.NODE_ENV === 'test'

const sequelize = isTest
  ? new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      String(process.env.DB_PASS), 
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
      }
    )
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    })

module.exports = { sequelize }
