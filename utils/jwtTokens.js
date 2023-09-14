const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Generate and Verify JWT tokens
const generateJWT = (email) => {
  return jwt.sign({email}, 'secret', { expiresIn: '1h'});
}

const verifyJWT = (token) => {
  if (!token) {
    console.log("TOKEN IS NULL OR undefinied or something is wrong")
    return null;
  }
  try {
    return jwt.verify(token, 'secret');
  }
  catch (error) {
    console.log(`JWT ERROR: ${error}`);
    return null
  }
}

module.exports = { generateJWT, verifyJWT}
