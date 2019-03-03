
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { INVALID_ACCESS_TOKEN, INTERNAL_SERVER_ERROR } = require('../constants/errors');
const { jwtSecret } = require('../config/keys');

const userAuthentication = (req, res, next) => {
	const { authorization } = req.headers;

	if (typeof authorization !== 'undefined') {
		const bearer = authorization.split(' ');
		const accessToken = bearer[1];

		jwt.verify(accessToken, jwtSecret, (err, decoded) => {
			if (err) {
				return res.status(401).json({ error: { message: INVALID_ACCESS_TOKEN }});
			}

			const { id } = decoded.payload;

			User.findById(id, (e, user) => {
				if (e) {
					return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }});
				}
				req.user = user;
				next();
			});
		});
	} else {
		res.status(401).json({ error: { message: 'MISSING AUTHORIZATION HEADER' }});
	}
};

module.exports = userAuthentication;