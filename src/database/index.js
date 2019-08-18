const mongoose = require('mongoose')

mongoose.connect('mongodb://db:27017/chekin', { useNewUrlParser: true })
mongoose.Promise = global.Promise

module.exports = mongoose 