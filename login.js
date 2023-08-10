const express = require('express')
const loginRouter = express.Router()

loginRouter.get('/', (req, res) => {
  console.log("Getting login")
  res.render("login")
})

console.log("HI")

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
 
const users = [
  {name: "Admin"},
  {name: "Bee"}
]

loginRouter.param("id", (req, res, next, id) => {
  console.log(id)
  req.user = users[id]
  next()
})



module.exports = loginRouter