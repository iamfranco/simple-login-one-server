require("dotenv").config()
const genHashSalt = require("./auth").genHashSalt
const port = process.env.PORT || 5000
const clientHomepage = process.env.CLIENT_URI
const clientLoginPage = `${clientHomepage}/login`

function setRoutes(app, User, passport) {
  app.get("/api", (req, res) => {
    res.send("Backend is working")
  })

  app.post("/api/register", (req, res) => {
    const username = req.body.username || ""
    const password = req.body.password || ""

    if (username == "" || password == "") {
      return res.json({
        success: false,
        message: "Username and password cannot be empty"
      })
    }

    // fail if username already exists
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return res.json({
          success: false,
          message: "Error during MongoDB username search, try again later"
        })
      }

      if (user) {
        return res.json({
          success: false,
          message: "Username already taken"
        })
      } else {
        // store new username and hashed password to mongoDB
        const { hash, salt } = genHashSalt(password)
        User.create(
          {
            displayName: username,
            username: username,
            hash: hash,
            salt: salt,
            someNumber: 0
          },
          (err, user) => {
            if (err) {
              return res.json({
                success: false,
                message: "Error during MongoDB create new user, try again later"
              })
            }
            req.login(user, err => {
              if (err) {
                return res.json({
                  success: false,
                  message: "User successfully created, but error during login"
                })
              }
              return res.json({
                success: true
              })
            })
          }
        )
      }
    })
  })

  app.post("/api/login", passport.authenticate("local", { failureRedirect: "/api/login/failure" }), (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({
        success: true
      })
    }
  })

  app.get("/api/login/failure", (req, res) => {
    return res.json({
      success: false,
      message: "login failed"
    })
  })

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile"] }))

  app.get("/api/auth/google/callback", passport.authenticate("google", { failureRedirect: clientLoginPage }), function (req, res) {
    res.redirect(clientHomepage)
  })

  app.get("/api/logout", (req, res) => {
    req.logout()
    res.send("logged out")
  })

  app.get("/api/getuser", (req, res) => {
    res.send(req.user)
  })

  app.post("/api/setUser", ensureAuthenticated, (req, res) => {
    const id = req.user._id
    User.findOneAndUpdate({ _id: id }, req.body, err => {
      if (err)
        return res.json({
          success: false,
          message: "error during findOneAndUpdate"
        })
      return res.json({
        success: true
      })
    })
  })

  app.listen(port, () => {
    console.log("Listening on " + port)
  })
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.json({
      success: false,
      message: "not authenticated"
    })
  }
}

module.exports = setRoutes
