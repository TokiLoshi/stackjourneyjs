const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
  res.clearCookie('newtoken')
  req.flash('success', 'Logged you out')
  return res.redirect('/')
})

module.exports = logoutRouter;