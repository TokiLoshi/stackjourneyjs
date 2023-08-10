const express = require('express')
const router = express.Router()



router.get("/", (req, res) => {
  res.send("User List")
})

router.get("/newuser", (req, res) => {
  res.send("New Form")
})

module.exports = router 