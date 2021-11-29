const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const findOrCreate = require('mongoose-findorcreate')
const app = express()

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String
})
userSchema.plugin(findOrCreate)
const User = new mongoose.model('User', userSchema)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

const GoogleStrategy = require('passport-google-oauth2').Strategy

passport.use(new GoogleStrategy({
    clientID: '***',
    clientSecret: '***',
    callbackURL: '***',
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user)
    })
  }
))
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']

  }))

app.get('/auth/google/secrets',
  passport.authenticate('google', {
    successRedirect: '/auth/google/secret',
    failureRedirect: '/auth/google/failure'
  }))

app.get('/auth/google/secret', (req, res) => {
  console.log(req)
    res.send('It\'s ok')
})

mongoose.connect('mongodb://localhost:27017/testdbuser', { useNewUrlParser: true, useUnifiedTopology: true })
app.listen(3000, () => {
  console.log('Server is run...')
})
