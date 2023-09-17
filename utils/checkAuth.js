const { verifyJWT } = require('./jwtTokens');
const cookieParser = require('cookie-parser');

const checkAuthentication = (req, res, next) => {
  const token = req.cookies.newtoken;
  console.log(`Token: ${token}`)

  req.isAuthenticated = false;

  if (!token){
    
    return next();
  }

  try {
    const valid = verifyJWT(token, 'secret');
    if (valid) {
      req.isAuthenticated = true;
      req.user = valid;
      console.log(`In checkAUTH: ${req.isAuthenticated}, valid: ${req.user.email}`)
      return next();
    }
  }
  catch(error) {
    console.log(`checkAuth.js Error found, oh no! ${error}`);
    if (error.name === 'TokenExpiredError'){
      res.clearCookie('newtoken'); 
    }
    return next();
  }

return next();
}

module.exports = checkAuthentication;