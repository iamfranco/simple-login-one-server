require("dotenv").config()
const LocalStrategy = require("passport-local")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const crypto = require("crypto")

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
}

function genHashSalt(password) {
  const salt = crypto.randomBytes(32).toString("hex")
  const hash = hashPassword(password, salt)
  return { hash, salt }
}

function verifyPassword(user, password) {
  return hashPassword(password, user.salt) === user.hash
}

function setup(passport, User) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) return done(err)
        if (!user) return done(null, false)
        if (!verifyPassword(user, password)) return done(null, false)
        return done(null, user)
      })
    })
  )

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, (err, user) => {
          if (err) return done(err)
          if (!user) {
            // if user doesn't exist in MongoDB, then create it
            User.create(
              {
                googleId: profile.id,
                displayName: profile.name.givenName,
                someNumber: 0
              },
              (err, user) => {
                if (err) return done(err)
                return done(null, user)
              }
            )
          } else {
            return done(null, user)
          }
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    return done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) return done(err, false)
      return done(null, user)
    })
  })
}

module.exports.setup = setup
module.exports.genHashSalt = genHashSalt
