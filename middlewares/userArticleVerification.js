const { UNAUTHORIZE_USER } = require('../constants/errors');

const userArticleVerification = (req, res, next) => {
	const { user } = req;

	if (user.role.toLowerCase() !== 'master') {
		return res.status(401).json({ error: { message: UNAUTHORIZE_USER } });
	}
	next();
};

module.exports = userArticleVerification;