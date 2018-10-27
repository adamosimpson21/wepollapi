require("dotenv").load();
let jwt = require("jsonwebtoken");
const db = require('../models');

//make sure the user is logged in -Authentication
exports.loginRequired = function(req, res, next){
  try{
    const token = req.headers.authorization.split(" ")[1] // Bearer [token]
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
      if(decoded){
        return next();
      } else {
        return next({
          status: 401,
          message: "Token not Verified"
        })
      }
    })
  } catch(err){
    return next({
      status: 401,
      message: "Please Log in to do this"
    })
  }
}

//make sure we get the correct user - Authorization
exports.ensureCorrectUser = function(req, res, next){
  try{
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
      if(decoded && decoded.id === req.params.id){
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized, Wrong User"
        })
      }
    })
  } catch(err){
    return next({
      status: 401,
      message: "Access Denied"
    })
  }
}

exports.adminOnly = async function(req, res, next){
  try{
    let user = await db.User.findById(req.params.id)
    if(user.authLevel === 'admin' || user.authLevel === 'founder'){
      return next();
    } else {
      return next({
        status: 401,
        message: "Access Denied"
      })
    }
  } catch(err){
    return next({
      status:401,
      message: "Access Denied"
    })
  }
}

exports.subscriberOnly = async function(req, res, next){
  try{
    let user = await db.User.findById(req.params.id)
    if(user.authLevel === 'subscriber' || user.authLevel === 'founder' || user.authLevel === 'admin'){
      return next();
    } else {
      return next({
        status: 401,
        message: "Access Denied"
      })
    }
  } catch(err){
    return next({
      status:401,
      message: "Access Denied"
    })
  }
}