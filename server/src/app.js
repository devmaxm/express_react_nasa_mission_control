const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

const router = require('./routes/api')

const app = express()

// MIDDLEWARES
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


//TEST
async function delay(time) {
    const startTime = Date.now()
    while((Date.now() - startTime) < time) {

    }
}
app.get('/timer', async (req, res) => {
    await delay(4000)
    res.send('ping pong')
})

// ROUTES
app.use('/api', router)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


module.exports = app
