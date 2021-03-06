const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next){
  try {
    let user = await db.User.findOne({
      username: req.body.username
    })
    let {id, username} = user
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign({
        id, username
      }, process.env.SECRET_KEY)
      return res.status(200).json({
        user, token
      })
    } else {
      return next({
        status: 400,
        message: "Invalid UserName/Password. Try again."
      })
    }
  } catch(err){
    return next({
      status: 400,
      message: "Invalid UserName/Password. Try again."
    })
  }
}

exports.signup = async function(req, res, next){
  try {
    let user = await db.User.create(req.body)
    let { id, username } = user
    let token = jwt.sign({
      id,
      username
    }, process.env.SECRET_KEY)
    return res.status(200).json({
      user, token
    })

  } catch(err) {
    if(err.code === 11000){
      err.message = "Sorry, that username is taken"
    }
    return next({
      status:400,
      message: err.message
    })
  }
}

exports.hydrate = async function(req, res, next){
  try {
    let user = await db.User.findOne({
      username: req.body.username
    })
    let {id, username} = user
    let token = jwt.sign({
      id, username
    }, process.env.SECRET_KEY)
    return res.status(200).json({
      user, token
    })
  } catch(err){
    return next({
      status: 400,
      message: "Invalid UserName/Password. Try again."
    })
  }
}