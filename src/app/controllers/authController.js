const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const authConfig = require('../../config/auth')

const router = express.Router()

generationToken = (params = {}) => {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })

  return token
}

router.post('/register', async (req, res) => {
  try {
    if (await User.findOne({ 'email': req.body.email }))
      return res.status(400).send({ error: 'User alredy exists ' })

    const user = await User.create(req.body)

    user.password = undefined

    return res.send({ user, token: generationToken({ userId: user._id }) })

  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find({})

    const userWithoutPassword = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: undefined,
      createdAt: user.createdAt
    }))

    return res.send(userWithoutPassword)
  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: 'Invalid password' })

    return res.send({ user, token: generationToken({ id: user.id }) })

  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

module.exports = app => app.use('/auth', router)
