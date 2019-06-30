const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.status(400).send({ error: 'No token provied' })

  const parts = authHeader.split(' ')
  const [schema, token] = parts

  if (!parts.length === 2)
    return res.status(400).send({ error: 'token error' })

  if (!/^Bearer$/i.test(schema))
    return res.status(400).send({ error: 'Token malformatted' })

  jwt.verify(token, authConfig.secret, (err, decode) => {
    if (err)
      return res.status(401).send({ error: 'Token invalid' })

    req.userId = decode.id
    return next()
  })
}
