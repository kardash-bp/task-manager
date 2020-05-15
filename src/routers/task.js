const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.get('/tasks', auth, async (req, res) => {
  const match = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  const sort = {}
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (err) {
    res.status(500).send(err.message)
  }
})
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send('No task')
    }
    res.send(task)
  } catch (err) { res.status(500).send(err.message) }
})
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err.message)
  }
})
router.patch('/tasks/:id', auth, async (req, res) => {
  const allowedUpdates = ['description', 'completed']
  const updates = Object.keys(req.body)
  const isValid = updates.every(up => allowedUpdates.includes(up))
  if (!isValid) {
    return res.status(400).send('Invalid updates')
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    updates.forEach(update => {
      task[update] = req.body[update]
    })
    await task.save()

    res.send(task)
  } catch (e) {
    res.status(400).send(e.message)
  }
})
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send('task with given id doesn\'t exist!')
    }
    res.send(task)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
