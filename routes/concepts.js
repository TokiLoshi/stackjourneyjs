const express = require('express');
const conceptRouter = express.Router();
const checkAuth = require('../utils/checkAuth');

conceptRouter.use(checkAuth);

conceptRouter.get('/', (req, res) => {
  console.log("Getting concepts")
  if (!req.isAuthenticated){
    req.flash('error', 'You must be logged in to see that page');
    return res.redirect('/login');
  }

  console.log("User is authenticated but something else is going wrong")
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