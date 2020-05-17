const mongoose = require('mongoose')

class Database {
  constructor () {
    this._connect()
  }

  _connect () {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
      .then(() => {
        console.log('Database connection successful')
      }).catch(err => {
        console.error('Database connection error', err.message)
      })
  }
}

module.exports = new Database()
