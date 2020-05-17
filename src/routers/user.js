const express = require('express')
const router = express.Router()
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const sendEmail = require('../emails/account')
// get user profile
router.get('/users/me', auth, (req, res) => {
  res.send(req.user)
})

// sign in
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendEmail(user.email, user.name, 'Thanks for joining in.', `Welcome to the app, ${user.name}. Let me know how you get along with the app.`)
    const token = await user.generateAuthToken()

    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send(err.message)
  }
})
// log in
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.authenticate(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    res.status(400).send(err.message)
  }
})
// log out
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send('Logged out!')
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send('Logged all out!')
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.patch('/users/me', auth, async (req, res) => {
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const updates = Object.keys(req.body)
  const isValid = updates.every(update => allowedUpdates.includes(update))
  if (!isValid) {
    return res.status(400).send('Invalid updates')
  }
  try {
    updates.forEach(update => {
      req.user[update] = req.body[update]
    })

    await req.user.save()

    res.send(req.user)
  } catch (e) {
    res.status(400).send(e.message)
  }
})
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    sendEmail(req.user.email, req.user.name, `Goodbye, ${req.user.name}.`, 'I hope to see you back sometime soon.')
    res.send(req.user)
  } catch (err) {
    res.status(500).send(err.message)
  }
})
// upload files
const upload = multer({

  limits: {
    filesize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      const err = new Error('Must be image.')
      err.status = 400
      return cb(err)
    }
    cb(undefined, true)
  }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
})
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send(req.user)
})
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send(e)
  }
})
module.exports = router
