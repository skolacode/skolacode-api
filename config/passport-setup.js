const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../models/user');
const { github } = require('./keys');

passport.use(new GitHubStrategy({
  clientID: github.clientID,
  clientSecret: github.clientSecret,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback",
  state: github.state,
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));
