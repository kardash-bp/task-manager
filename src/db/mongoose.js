const mongoose = require('mongoose')

const dbUrl = process.env.DB_URL

class Database {
  constructor () {
    this._connect()
  }

  _connect () {
    mongoose.connect(dbUrl, {
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
