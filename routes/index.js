const express = require('express');
const homeRouter = express.Router();
const { verifyJWT } = require('../utils/jwtTokens');
const cookieParser = require('cookie-parser');
const checkAuth = require('../utils/checkAuth');

homeRouter.use(checkAuth)

console.log('Home Page is here')


homeRouter.get('/', (req, res) => {

console.log(`Is the user Authenticated?: ${req.isAuthenticated} Passing this along to home page`)
return res.render('index', { isAuthenticated: req.isAuthenticated })
  
  
  
})



module.exports = homeRouter;