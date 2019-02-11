import config from './../config/config'//set port number for app
import app from './express'//import configured express app
import mongoose from 'mongoose'

// Connection URL
mongoose.Promise = global.Promise//configure mongoose to handle Promises
mongoose.connect(config.mongoUri)
mongoose.connection.on('error', () => {
  throw new Error(`UNABLE TO CONNECT TO DATABASE: ${mongoUri}`)
})//use mongoose to handle connection to MongoDB database 

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('SERVER STARTED ON PORT %s.', config.port)
})
