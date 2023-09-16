const jwt = require('jsonwebtoken');

const generateJWT = (email) => {
  return jwt.sign({email}, 'secret', { expiresIn: '1h'});
}

const verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
}


module.exports = { generateJWT, verifyJWT }

