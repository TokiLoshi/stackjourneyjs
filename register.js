const express = require('express')
const registerRouter = express.Router()

const users = []

registerRouter.get('/', (req, res) => {
  console.log("Getting Registration")
  res.render("register")
  res.json(users)
})



registerRouter.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt)
    console.log(hashedPassword)
    const user = { name: req.body.name, password: hashedPassword}
    users.push(user)
    res.status(201).send()
  }
  catch {
    res.status(500).send()
  }
  
})

module.exports = registerRouter