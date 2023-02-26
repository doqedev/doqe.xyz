module.exports = (HTTP_PORT) => {
    const express = require('express')
    const app = express()
    const cloudscraper = require('cloudscraper')
    const axios = require('axios')
    const rateLimit = require('express-rate-limit')
    const http = require('http')
    const server = http.createServer(app)

    const limiter = rateLimit({
        windowMs: 1000 * 60,
        max: 29,
        standardHeaders: true,
        legacyHeaders: false
    })

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api/webhooks', limiter)

    app.get('/', (req, res) => {
        res.redirect('http://doqe.xyz/')
    })

    app.get('/api/webhooks/:id/:token', (req, res) => {
        cloudscraper.get(`https://discord.com/api/webhooks/${req.params.id}/${req.params.token}`).then((resp) => {
            res.json(JSON.parse(resp))
        }, console.error)
    })

    app.post('/api/webhooks/:id/:token', (req, res) => {
        var config = {
            method: 'post',
            url: `https://discord.com/api/webhooks/${req.params.id}/${req.params.token}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        };

        axios(config)
            .then(function (response) {
                res.send(response.data)
            })
            .catch(function (error) {
                res.status(500).send("Something went wrong!")
                console.log(error);
            });
    })

    app.get('/statusping', (req, res) => {
        if (req.headers['user-agent'] != 'Better Uptime Bot Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36') return res.status(404).send("ur weird lol");
        // console.log("Pinged by status.doqe.xyz")
        res.send("Pinged!")
    })

    server.listen(HTTP_PORT || 8080, () => {
        console.log('Webhook Server Ready')
    })
}