const http = require('http');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
eventEmitter.on('start', number => {
  console.log(`started ${number}`)
})
eventEmitter.emit('start', 23);


const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('ContentType', 'text/plain')
  res.end('Hello World this is StackJourney');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

const express = require('express');
const app = express();
app.get('/', function (req, res){
  res.send("Express says hello!")
})
app.get('/', (request, response) => {
  readFile('./index.html', 'utf8', (err, html) => {
    if (err) {
      response.status(500).send('Sorry something seems to be out of order')
    }
    response.send(html)
  })
});

app.listen(process.env.PORT || 3000, () => console.log(`App available on http://127.0.0.1:3000/`))