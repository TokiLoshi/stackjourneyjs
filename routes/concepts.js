const express = require('express');
const conceptRouter = express.Router();
const morgan = require('morgan');
const checkAuth = require('../utils/checkAuth');

conceptRouter.use(checkAuth);

conceptRouter.use(express.urlencoded({ extended: true }));
conceptRouter.use(morgan('tiny'));

conceptRouter.get('/', (req, res) => {
  if (!req.isAuthenticated){
    req.flash('error', 'You must be logged in to see that page');
    return res.redirect('/login', 200, {isAuthenticate: req.isAuthenticated})
  }
  console.log("Getting Concepts");
  res.render("concepts", { isAuthenticated: req.isAuthenticated });
})

conceptRouter.post('/', (req, res) => {
  console.log('Post request');
  console.log(req);
  console.log(req.body);
  console.log("Authorized? : ", req.isAuthenticated);
  res.redirect('/concepts', { isAuthenticated: req.isAuthenticated })

})

module.exports = conceptRouter;