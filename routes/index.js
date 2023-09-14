const express = require('express');
const homeRouter = express.Router();
const { verifyJWT } = require('../utils/jwtTokens');
const cookieParser = require('cookie-parser');

console.log('Home Page')


homeRouter.get('/', (req, res) => {
  const token = req.cookies.newtoken
  console.log(token)
  const valid = verifyJWT(req.cookies.newtoken)
  if (valid.email) {
    console.log("User is authorized", valid.email)
    req.flash('success', `Welcome back! ${valid.email}`)
    return res.render('index')
  }
  else {
    console.log("User is not authorized")
    req.flash('error', `You are NOT authorized and your email is ${token.email}`)

  }
  
  
})



module.exports = homeRouter;