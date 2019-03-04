const { UNAUTHORIZE_USER } = require('../constants/errors');

const userRoleVerification = (req, res, next) => {
	const { user } = req;

	if (user.role === 'writer') {
		return res.status(401).json({ error: { message: UNAUTHORIZE_USER } });
	}

	next();
};

module.exports = userRoleVerification;