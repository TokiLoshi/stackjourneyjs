const express = require('express');
const { verifyJWT } = require('./jwtTokens')

const checkAuthentication = (req, res, next) => {
  const token = req.cookies.newtoken;
  req.isAuthenticated = false;
  console.log("Token:", token)
  try {
    if (token){
      const valid = verifyJWT(req.cookies.newtoken);
      req.isAuthenticated = true;
      req.user = valid;
    }
  }
  catch(error) {
    next(error);
  }
console.log('Didn not catch the token all must be well')
next();
}

module.exports = checkAuthentication;