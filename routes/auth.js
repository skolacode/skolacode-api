const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/keys');
const router = express.Router();

// REDIRECT USER TO GITHUB 
router.get('/github', passport.authenticate('github'));

// CALLBACK AFTER LOGIN
router.get('/github/callback',
	passport.authenticate('github', { failureRedirect: '/api/v1/github/failed' }),
	(req, res) => {
		const { _id, role } = req.user;
		
		jwt.sign(
			{ payload: { id: _id, role }},
			jwtSecret, (err, token) => {
				if (err) {
					return res.status(500).json({ error: { message: 'FAILED TO SIGN TOKEN' } });
				}
				res.redirect(`/?accessToken=${token}`);
			}
		);
	}
);

// IF FAILED TO LOGIN
router.get('/github/failed', (req, res) => {
	res.send('FAILED');
});

module.exports = router;
