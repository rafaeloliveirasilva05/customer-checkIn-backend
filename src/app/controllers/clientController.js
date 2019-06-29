const express = require('express')
const Client = require('../models/client')

const router = express.Router()

router.post('/saveClientsDataJson', async (req, res) => {
  const { dataClients } = req.body

  try {
    dataClients.forEach(async data => await Client.create(data))
    return res.send({ 'save': 'ok' })

  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.get('/listClients', async (req, res) => {
  try {
    const clients = await Client.find({})
    return res.send({ clients })

  } catch (error) {
    return res.status(400).send({ error: 'Failed to show clients' })
  }
})

router.get('/getClient/:cpf', async (req, res) => {
  const { cpf } = req.params

  try {
    const client = await Client.findOne({ cpf })
    return res.send({ client })

  } catch (error) {
    return res.status(400).send({ error: 'Failed to show client' })
  }
})

router.patch('/checkIn/:cpf', async (req, res) => {
  const { cpf } = req.params
  const { presenceRecord } = req.body

  try {
    const client = await Client.findOneAndUpdate({ cpf }, { presenceRecord })
    return res.send({ client })

  } catch (error) {
    return res.status(400).send({ error: 'Failed to check in' })
  }
})

module.exports = app => app.use('/client', router)
