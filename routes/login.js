const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateJWT, verifyJWT }  = require('../utils/jwtTokens');

const sheedDb = process.env.SHEETS_URL;

loginRouter.get('/', (req, res) => {
  console.log("Getting login");
  res.render("login", {messages : req.flash()});
})

loginRouter.post('/', async (req, res) => {
  console.log("User wants to login");
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  if (!email) {
    const failureMessage = "Please enter your email";
    req.flash('error', failureMessage);
    return res.redirect('login');
  }
  if (!password) {
    const failureMessage = "Please enter your password";
    req.flash('error', failureMessage);
    return res.redirect('login');
  }
  
  else {
    const response = await fetch(sheedDb + `/search?username=${email}`)
    const data = await response.json()
    console.log("DATA IS HEREEEEE!!!!!", data)
    if (data.length) {
    const userPassword = data[0].password
    const isMatch = await bcrypt.compare(password, userPassword)
    console.log("MATCHY MATCHY:", isMatch)
    if (isMatch) {
      const successMessage = "Welcome back";
      const token = generateJWT(email);
      console.log(`Token: ${token}`)
      res.cookie('newtoken', token, {
        httpOnly: false, 
        secure: true, 
        maxAge: 10000 * 60 * 60 * 24 * 7
      })
      req.flash('success', successMessage);
      return res.render('concepts');
      }
      else {
        const failureMessage = "Incorrect email or password";
        req.flash('error', failureMessage);
        res.redirect('login')
      }
    }
    else {
      const failureMessage = "Incorrect email or password";
      req.flash('error', failureMessage);
      return res.redirect('login')
    }
}})

loginRouter.route('/:id')
.get((req, res) => {
  console.log(req.user)
  res.send(`Get user with ID: ${req.params.id}`)
})
.put((req, res) => {
  res.send(`Update user with id ${req.params.id}`)
})
.delete((req, res) => {
  res.send(`Delete user with id: ${res.params.id}`)
})
 

loginRouter.param("id", (req, res, next, id) => {
  console.log(id)
  req.user = users[id]
  next()
})



module.exports = loginRouter