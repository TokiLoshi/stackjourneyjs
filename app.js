const express = require("express")
const fetch = require("cross-fetch")
const path = require("path")
const app = express()
const bcrypt = require('bcrypt')
const _ = require('lodash')

function logger(req, res, next) {
  console.log(req.originalUrl)
  const num = _.random(0, 20);
  console.log("Num: ", num)
  next()
}

app.use(logger)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const userRouter = require('./users')
const aboutRouter = require('./about')
const dashboardRouter = require('./dashboard')
const conceptRouter = require('./concepts')
const loginRouter = require('./login')
const registerRouter = require('./register')


app.use('/users', userRouter)
app.use('/about', aboutRouter)
app.use('/dashboard', dashboardRouter)
app.use('/concepts', conceptRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)

app.get("/", (req, res) => {
  console.log("Here")
  console.log(`Here we have: ${users}`)
  res.render("index", {text: "Hello World",
  
moreText : "Does more text work?"})
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