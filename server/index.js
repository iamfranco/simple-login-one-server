require("dotenv").config()
const express = require("express")
const passport = require("passport")
const session = require("express-session")

const connectDB = require("./connectDB")
const auth = require("./auth")
const setRoutes = require("./routes")
const { path } = require("express/lib/application")

const app = express()

// if http, then redirect to https
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") res.redirect(`https://${req.header("host")}${req.url}`)
    else next()
  })
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("trust proxy", 1)

const User = connectDB.User
const sessionStore = connectDB.sessionStore

auth.setup(passport, User) // passport JS strategies (local and Google)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static("client/build"))

setRoutes(app, User, passport)

// load static files from ./build folder
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
})
