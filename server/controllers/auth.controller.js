import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = (req, res) => {
  //search database for matching input email
  User.findOne({
    "email": req.body.email
  }, (err, user) => {

    if (err || !user)//if user email does not exist
      return res.status('401').json({
        error: "USER NOT FOUND"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({//if email/password combination cannot be authenticated
        error: "EMAIL AND PASSWORD DON'T MATCH"
      })
    }

    const token = jwt.sign({//create JWT signed with secret key
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.json({//return authentication
      token,
      user: {_id: user._id, name: user.name, email: user.email}
    })

  })
}

const signout = (req, res) => {
  res.clearCookie("t")//clear JWT to destroy previous authentication state
  return res.status('200').json({
    message: "SIGNED OUT"
  })
}

const requireSignin = expressJwt({//secure protected routes; check for a valid JWT in authorization header
  secret: config.jwtSecret,
  userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {//check user id vs id of data to be updated/deleted
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "USER IS NOT AUTHORIZED!"
    })
  }
  next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
