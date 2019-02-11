import mongoose from 'mongoose'
import crypto from 'crypto'

//define user
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'NAME IS REQUIRED'
  },
  email: {
    type: String,
    trim: true,
    unique: 'EMAIL ALREADY EXISTS',
    match: [/.+\@.+\..+/, 'PLEASE PROVIDE A VALID EMAIL ADDRESS'],
    required: 'EMAIL IS REQUIRED'
  },
  hashed_password: {//actual password is not stored in the database for security purposes
    type: String,
    required: "PASSWORD IS REQUIRED"
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  about: {
    type: String,
    trim: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
})

//when the password value is received on user creation or update, it is encrypted into a new hashed value and set to the hashed_password field, along with the salt value in the salt field
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

  //password validation: 6 characters or more
UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'PASSWORD MJST BE AT LEAST 6 CHARACTERS')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'PASSWORD IS REQUIRED')
  }
}, null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },//called when user provides password upon sign in
  encryptPassword: function(password) {
    //called when a new password is created, along with makeSalt
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema)
