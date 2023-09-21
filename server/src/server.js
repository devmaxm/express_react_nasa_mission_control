require('dotenv').config()
const http = require('http')
const mongoose = require('mongoose')
const app = require('./app')
const {loadPlanetData} = require("./models/planets.model");

const PORT = process.env.PORT || 8000
const MONGO_URL = process.env.MONGO_URL


const server = http.createServer(app)

mongoose.connection.once('open', () => {
    console.log('Mongodb connected')
})

async function bootstrap() {
    await mongoose.connect(MONGO_URL)
    // loadPlanetData()
    server.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}

bootstrap()

