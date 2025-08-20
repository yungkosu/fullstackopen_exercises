const jwt = require('jsonwebtoken')
const User = require('../models/users')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}


const userExtractor = async (request, response, next) => {

const token = request.token
const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

const user = await User.findById(decodedToken.id)

if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  request.user = user
  next()
}




module.exports = {tokenExtractor, userExtractor}