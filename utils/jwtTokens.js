const jwt = require('jsonwebtoken');

// Generate and Verify JWT tokens
const generateJWT = (email) => {
  console.log("MIDDLEWARE: GENERATING NEW JWT")
  return jwt.sign({email}, 'secret', { expiresIn: '1h'});
}

const verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
}

const decodeJWT = (res, req, next) => {
  console.log("MIDDLEWARE: DECODEJWT");
  return next();
  // try {
  //   const token = req.cookies.newtoken;
  //   if (token){
  //     const decodedToken = jwt.verify(token, secret);
  //     console.log("Decoded Token: ", decodedToken);
  //     req.userEmail = decoded.email;
  //     console.log(req.userEmail)
  //     return next();
  //   }
  // }
  // catch (error) {
  //   req.isAuthenticated = false;
  //   console.log("Auth status decoding token?", req.isAuthenticated)
  //   console.log(`Error decoding token: ${error}`)
  //   return next();
  // }
};

module.exports = { generateJWT, verifyJWT, decodeJWT }

