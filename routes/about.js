const express = require('express');
const aboutRouter = express.Router();
const checkAuth = require('../utils/checkAuth');

aboutRouter.use(checkAuth);

aboutRouter.get('/', (req, res) => {
  console.log("Getting about")

  res.render("about", { isAuthenticated: req.isAuthenticated })
})

module.exports = aboutRouter