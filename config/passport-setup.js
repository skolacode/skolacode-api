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
		User.find({
			githubID: profile.id
		}, (err, docs) => {
			if (err) {
				return done(err, null);
			}

			if (docs.length === 0) {
				User.create({
					githubID: profile.id,
					github: profile.username,
				}, (e, d) => {
					if (!e) {
						return done(e, d);
					}
				});
			} else {
				return done(err, docs);
			}	
		});
	})
);
