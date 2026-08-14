const mongoose = require("mongoose")

async function connecttomongoose() {
    return mongoose.connect("mongodb://localhost:27017/pgmanagement")
}

module.exports = {connecttomongoose} 