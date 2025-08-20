const getTokenFrom = (request, response) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
return null
}


module.exports = getTokenFrom