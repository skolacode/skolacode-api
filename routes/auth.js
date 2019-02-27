const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: 'user' }));

router.get('/github/callback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		res.redirect('/');
	});

router.get('/github/failed', (req, res) => {
	res.send('FAILED');
});

module.exports = router;
