const mongoose = require('mongoose')

const url = 'mongodb+srv://admin:123Senac@cluster0.zbct0.mongodb.net/dbnotas'

let connected = false

const connectDB = async () => {
    if (!connected) {
        try {
            await mongoose.connect(url)
            connected = true
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

const disconnectDB = async () => {
    if (connected) {
        try {
            await mongoose.disconnect(url)
            connected = false
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

module.exports = { connectDB, disconnectDB }