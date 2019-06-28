const express = require('express')

const User = require('../models/user')

const router = express.Router()

router.post('/register', async (req, res) => {

  try {
    if (await User.findOne({ 'email': req.body.email }))
      return res.status(400).send({ error: 'User alredy exists ' })

    const user = await User.create(req.body)

    user.password = undefined
    return res.send(user)
  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find({})
    return res.send({ 'users': users })
  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})


module.exports = app => app.use('/auth', router)