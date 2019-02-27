const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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

router.get('/github/token/sign', (req, res) => {
	const token = jwt.sign({
		email: 'test',
	}, 'secret');
	res.send(token);
});

router.get('/github/:token', (req, res) => {
	const { token } = req.params;
	jwt.verify(token, 'secret', function(err, decoded) {
		if (err) {
			console.log('ERR => ', err);
		}
		console.log('DECODE => ', decoded.email);
	});
	res.send('VERI');
});

module.exports = router;
