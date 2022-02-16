require("dotenv").config()
const express = require("express")
const passport = require("passport")
const session = require("express-session")
const cors = require("cors")

const connectDB = require("./connectDB")
const auth = require("./auth")
const setRoutes = require("./routes")
const { path } = require("express/lib/application")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors({ origin: process.env.CLIENT_URI, credentials: true }))

app.set("trust proxy", 1)

const User = connectDB.User
const sessionStore = connectDB.sessionStore

auth.setup(passport, User) // passport JS strategies (local and Google)

// const isSiteRemoteSecure = process.env.URI_IS_REMOTE_SECURE === "TRUE"
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week

      // if site is remote and secure...
      // ...(isSiteRemoteSecure && {
      //   secure: true,
      //   sameSite: "none"
      // })
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
