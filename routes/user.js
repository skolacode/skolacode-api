const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const User = require('../models/user');
const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

// GET USER
router.get('/profile', (req, res) => {
	res.json(req.user);
});

// UPDATE USER
router.patch('/profile', [
	check('username').isString(),
	check('email').isString(),
	check('displayName').isString(),
	check('website').isString(),
	check('github').isString(),
	check('twitter').isString(),
	check('linkedIn').isString(),
], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	
	const { role, githubID } = req.user;
	const { _id } = req.user;
	
	User.findOneAndUpdate({ _id }, {
		...req.body,
		role,
		githubID,
	}, (err, user) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}
		return res.json(user);
	});
});

module.exports = router;
