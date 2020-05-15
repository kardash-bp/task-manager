const mongoose = require('mongoose')

const server = process.env.DB_HOST
const database = process.env.DB_NAME

class Database {
  constructor () {
    this._connect()
  }

  _connect () {
    mongoose.connect(`mongodb://${server}/${database}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).then(() => {
      console.log('Database connection successful')
    }).catch(err => {
      console.error('Database connection error', err.message)
    })
  }
}
module.exports = new Database()
