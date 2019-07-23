const express = require('express')

const Client = require('../models/client')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()
// router.use(authMiddleware)

router.post('/saveClientsDataJson', async (req, res) => {
  const { data } = req.body

  Client.collection.drop()

  try {
    data.forEach(async data => {

      let cpf = data.cpf.replace(/[( )\/\.\-]+/g, '')

      await Client.create({
        cpf,
        name: data.nome,
        roomType: data.tipo_quarto,
        gender: data.tipo,
        roomNumber: data.quarto
      })
    })
    return res.send({ 'save': 'ok' })

  } catch (error) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.get('/listClients', async (req, res) => {
  const { rowsPerPage, numberPage } = req.query

  try {
    const perPage = rowsPerPage && rowsPerPage > 0 ? parseInt(rowsPerPage) : 100
    const page = numberPage && numberPage > 0 ? parseInt(numberPage) : 1

    Client
      .find({})
      .populate('user')
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, dataClients) {
        Client.count().exec(function (err, count) {
          if (err)
            return res.status(400).send({ error: 'Failed to show clients' })

          dataClients.forEach((client) => {
            if (client.user)
              client.user.password = undefined
          })

          return res.send({ result: { dataClients }, total: count })
        })
      })

  } catch (error) {
    return res.status(400).send({ error: 'Failed to show clients' })
  }
})

router.get('/getClient/:cpf', async (req, res) => {
  const { cpf } = req.params

  try {
    const dataClient = await Client.findOne({ cpf }).populate('user')
    if (dataClient.user)
      dataClient.user.password = undefined

    return res.send({ dataClient })

  } catch (error) {
    return res.status(400).send({ error: 'Failed to show client' })
  }
})

router.patch('/checkIn/:cpf', async (req, res) => {
  const { cpf } = req.params

  try {
    const dataClient = await Client.findOneAndUpdate({ cpf }, { ...req.body, user: req.userId }, { new: true })

    return res.send({ dataClient })

  } catch (error) {
    return res.status(400).send({ error: 'Failed to check in' })
  }
})

router.get('/presenceData', async (req, res) => {
  const customerPresenceData = await Promise.all([
    Client.where({ 'gender': 'FEMININO' }).countDocuments(),
    Client.where({ 'gender': 'MASCULINO' }).countDocuments(),
    Client.where({ 'presenceRecord': 'true', 'gender': 'FEMININO' }).countDocuments(),
    Client.where({ 'presenceRecord': 'true', 'gender': 'MASCULINO' }).countDocuments()
  ])

  return res.send({ 
    'femaleTotal': customerPresenceData[0],
    'maleTotal': customerPresenceData[1],
    'femalePresence': customerPresenceData[2],
    'malePresence': customerPresenceData[3],
  })
})

module.exports = app => app.use('/client', router)
