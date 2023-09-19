const { verifyJWT } = require('./jwtTokens');
const cookieParser = require('cookie-parser');

const checkAuthentication = (req, res, next) => {
  const token = req.cookies.newtoken;

  req.isAuthenticated = false;

  if (!token){
    
    return next();
  }

  try {
    const valid = verifyJWT(token, 'secret');
    if (valid) {
      req.isAuthenticated = true;
      req.user = valid;
      return next();
    }
  }
  catch(error) {
    if (error.name === 'TokenExpiredError'){
      res.clearCookie('newtoken'); 
    }
    return next();
  }

return next();
}

module.exports = checkAuthentication;