const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../models/user');
const { github } = require('./keys');

const checkValue = (val) => {
	if (val) {
		return val;
	}
	return '';
};

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
			const { id, username, displayName } = profile;
			const { avatar_url, bio } = profile._json;
			console.log('PROFILE => ', profile);
			console.log('==============================');
			console.log('PROFILE JSON => ', profile._json);

			if (!user) {
				return User.create({
					githubID: id,
					github: checkValue(username),
					displayName: checkValue(displayName),
					bio: checkValue(bio),
					avatarUrl: checkValue(avatar_url),
				}, (e, u) => done(e, u));
			}
			
			return done(err, user);
		});
	})
);
