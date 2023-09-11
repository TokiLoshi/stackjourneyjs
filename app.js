if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
// TODO:
  // Update Heroku with secret key and env variables so it can be used in production

const express = require("express")
const fetch = require("cross-fetch")
const path = require("path")
const app = express()
const bcrypt = require('bcrypt')
const _ = require('lodash')
const morgan = require('morgan')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')


initializePassport(passport, email => {
  users.find(user => user.email === email)
})

app.set('view engine', 'ejs')
app.set('trust proxy', 1)

// Middleware & static files
// Logs HTTP requests to the console
app.use(morgan('tiny'))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())


let sessionConfig = {
  secret : process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true, 
  cookie: {
    // httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

if (app.get('env') === 'production'){
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sessionConfig))

// Routes
const userRouter = require('./users')
const aboutRouter = require('./routes/about')
const dashboardRouter = require('./routes/dashboard')
const conceptRouter = require('./routes/concepts')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')


app.use('/users', userRouter)
app.use('/about', aboutRouter)
app.use('/dashboard', dashboardRouter)
app.use('/concepts', conceptRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use(passport.initialize())
app.use(passport.session())


app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get("/", (req, res) => {
  res.render("index")
})

app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


module.exports = app;
// const serverless = require('serverless-http')
// module.exports = serverless(app);