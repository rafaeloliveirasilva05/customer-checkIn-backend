const mongoose = require('../../database')

const ClientSchema = new mongoose.Schema({
  name: {
    type: String
  },
  cpf: {
    type: String,
    unique: true,
    required: true
  },
  roomType: {
    type: String
  },
  gender: {
    type: String
  },
  roomNumber: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'User'
  },
  presenceRecord: {
    type: Boolean,
    default: false
  },
  datePresenceRecords: {
    type: Date,
    default: Date.now
  }
})

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client
