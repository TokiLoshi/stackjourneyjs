if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const fetch = require("cross-fetch");
const path = require("path");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const morgan = require('morgan');
const passport = require('passport');
const localStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const initializePassport = require('./passport-config');
const flash = require('connect-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { generateJWT, verifyJWT, decodeJWT } = require('./utils/jwtTokens');
const { checkAuthentication } = require('./utils/checkAuth');


initializePassport(passport, username => {
  users.find(user => user.username === email)
});

// Connect Routes
const about = require('./routes/about');
const concepts = require('./routes/concepts');
const login = require('./routes/login');
const users = require('./routes/users');
const dashboard = require('./routes/dashboard');
const register = require('./routes/register');
const home = require('./routes/index');
const logout = require('./routes/logout');

// Middleware & static files
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(morgan('tiny'))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Configuring sessions
let sessionConfig = {
  secret : process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true, 
  cookie: {
    httpOnly: true,
    secure: false,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

if(!process.env.SESSION_SECRET) {
  console.log('SESSION_SECRET is not set')
}

if (app.get('env') === 'production'){
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/users', users);
app.use('/about', about);
app.use('/dashboard', dashboard);
app.use('/concepts', concepts);
app.use('/login', login);
app.use('/register', register);
app.use('/', home);
app.use('/logout', logout);

app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
  const { statusCode = 500, message="Oh no something went wrong" } = err;
  if (!err.message) err.message = "Oops, something went wrong";
  res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;