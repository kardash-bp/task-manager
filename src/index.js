const express = require('express')

require('./db/mongoose')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(userRouter)
app.use(taskRouter)
// define error-handling middleware last, after other app.use() and routes calls
app.use(function (err, req, res, next) {
  if (!err.status) err.status = 500

  if (err.shouldRedirect) {
    res.render('errorPage', { error: err })
  } else {
    res.status(err.status).send(err.message)
  }
})

// def port &  start server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})
