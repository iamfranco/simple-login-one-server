require("dotenv").config()
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")

mongoose.connect(process.env.MONGO_URI, {}, () => {
  console.log("Connected to MongoDB")
})

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    displayName: { type: String, required: true },
    someNumber: { type: Number, required: true }, // some number for user to view and modify once logged in

    // for google strategy users
    googleId: { type: String, required: false },

    // for local strategy users
    username: { type: String, required: false },
    hash: { type: String, required: false },
    salt: { type: String, required: false }
  })
)

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  dbName: "simple-login",
  collectionName: "sessions"
})

module.exports.User = User
module.exports.sessionStore = sessionStore
