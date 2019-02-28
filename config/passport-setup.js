const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../models/user');
const { github } = require('./keys');


passport.use(
	new GitHubStrategy({
		clientID: github.clientID,
		clientSecret: github.clientSecret,
		callbackURL: 'http://localhost:8080/api/v1/oauth/github/callback',
	},
	(accessToken, refreshToken, profile, done) => {
		User.findOne({
			githubID: profile.id
		}, (err, user) => {
			if (err) {
				return done(err, null);
			}

			if (!user) {
				User.create({
					githubID: profile.id,
					github: profile.username,
				}, (e, u) => {
					if (!e) {
						return done(e, u);
					}
				});
			} else {
				return done(err, user);
			}	
		});
	})
);
