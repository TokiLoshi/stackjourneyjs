const express = require('express')
const conceptRouter = express.Router()
const morgan = require('morgan')

conceptRouter.use(express.urlencoded({ extended: true }))
conceptRouter.use(morgan('tiny'))

conceptRouter.get('/', (req, res) => {
  console.log("Getting Concepts")
  res.render("concepts")
})

conceptRouter.post('/', (req, res) => {
  console.log('Post request')
  console.log(req)
  console.log(req.body)
  res.redirect('/concepts')

})

module.exports = conceptRouter