const { verifyJWT } = require('./jwtTokens');
const cookieParser = require('cookie-parser');

const checkAuthentication = (req, res, next) => {
  console.log("MIDDLEWARE: CHECKING FOR AUTHENTICATION")
  const token = req.cookies.newtoken;
  console.log(`Token in check Auth: `, token)
  req.isAuthenticated = false;

  console.log("Token in check auth:", token)
  if (!token){
    console.log("NO TOKEN PRESENT, Where Do cookies go?");
    return next();
  }
  try {
    console.log("Checking validity of token in checkAuth, sending to tokens middleware");
    const valid = verifyJWT(token, 'secret');
    console.log("What do we get from valid? ", valid);
    if (valid) {
      req.isAuthenticated = true;
      req.user = valid;
      console.log("Token is valid! Yay!");
      return next();
    }
  }
  catch(error) {
    console.log("We have an authentication Error!", error)
    if (error.name === 'TokenExpiredError'){
      console.log('WE FOUND EXPIRED ERROR!');
      res.clearCookie('newtoken'); 
    }
    return next();
  }

console.log('Didn not catch the token all must be well');
return next();
}

module.exports = checkAuthentication;