const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

app.set('view engine', 'ejs')
app.set('views', __dirname + "\\views")
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(80, () => {
    console.log('Main Server Ready')
})

require('./webhook.server')() // will initialize a webhook server