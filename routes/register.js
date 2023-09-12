const express = require('express')
const registerRouter = express.Router()
const bcrypt = require('bcrypt')

let users = []

registerRouter.get('/', (req, res) => {
  console.log("Getting Registration")

  res.render("register")
 
})

registerRouter.post('/', async (req, res) => {
  console.log(req.body.username)
  console.log(req.body.password)
  console.log(req.body.confirmation)
  if (req.body.password !== req.body.confirmation){
    console.log("They don't match")
  }
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt)
    console.log(hashedPassword)
    users.push({
      id: Date.now().toString(), 
      username: req.body.username,
      password : hashedPassword
    })
    res.redirect('/login')
  }
  catch {
    res.status(500).send()
  }
  
  
})

module.exports = registerRouter