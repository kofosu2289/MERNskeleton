const config = {
  //differentiate between development and production mode
  env: process.env.NODE_ENV || 'development',
  //define listening port for the server
  port: process.env.PORT || 3000,
  //the secret key to be used to sign JWT
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  //location of the MongoDB database for the project
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/mernproject'
}

export default config
