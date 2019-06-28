const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/checkin', { useNewUrlParser: true })
mongoose.Promise = global.Promise

module.exports = mongoose 