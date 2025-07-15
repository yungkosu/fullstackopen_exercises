const config = require('./utils/config')
const app = require('./app')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)


app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})