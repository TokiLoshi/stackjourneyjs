// const http = require('http');
// const EventEmitter = require('events');
// const eventEmitter = new EventEmitter();
// eventEmitter.on('start', number => {
//   console.log(`started ${number}`)
// })
// eventEmitter.emit('start', 23);


// const hostname = '127.0.0.1'
// const port = 3000

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('ContentType', 'text/plain')
//   res.end('Hello World this is StackJourney');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`)
// })

// const express = require('express');
// const app = express();
// app.get('/', function (req, res){
//   res.send("Express says hello! There")
// })
// app.get('/', (req, res) => {
//   readFile('/index.html', 'utf8', (err, html) => {
//     if (err) {
//       res.status(500).send('Sorry something seems to be out of order')
//     }
//     res.send(html)
//   })
// });

// app.listen(process.env.PORT || 3000, () => console.log(`App available on http://127.0.0.1:3000/`))

// app.get('', (req, res) => {
//   res.status(500).json({ message: "Error"})
// })

const express = require("express")
const fetch = require("cross-fetch")
const app = express()

app.set('view engine', 'ejs')
app.use(logger)
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
  console.log("Here")
  res.render("index", {text: "Hello World",
moreText : "Does more text work?"})
})

const userRouter = require('./routes/users')
const aboutRouter = require('./routes/about')
const dashboardRouter = require('./routes/dashboard')
const conceptRouter = require('./routes/concepts')
const loginRouter = require('./routes/login')


app.use('/users', userRouter)
app.use('/about', aboutRouter)
app.use('/dashboard', dashboardRouter)
app.use('/concepts', conceptRouter)
app.use('/login', loginRouter)

function logger(req, res, next) {
  console.log(req.originalUrl)
  next()
}


// app.use('/login', loginRouter)


app.listen(3000)