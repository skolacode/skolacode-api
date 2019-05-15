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

const whiteListUser = ['aibrahim3546'];

passport.use(
	new GitHubStrategy({
		clientID: github.clientID,
		clientSecret: github.clientSecret,
		callbackURL: 'http://localhost:8080/api/v1/oauth/github/callback',
	},
	(accessToken, refreshToken, profile, done) => {
		const { id, username, displayName } = profile;
		const { avatar_url, bio } = profile._json;

		if (whiteListUser.indexOf(username) !== -1) {
			User.findOne({
				githubID: profile.id
			}, (err, user) => {
				if (err) {
					return done(err, null);
				}
	
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
		} else {
			return done(null, null);
		}
	})
);
