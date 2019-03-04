const Article = require('../models/article');
const { INTERNAL_SERVER_ERROR, UNAUTHORIZE_USER } = require('../constants/errors');

const userVerification = (req, res, next) => {
	const { user } = req;
	const { id } = req.params;

	Article.findById(id, 'author', (err, article) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		const { author } = article;
		if (!user._id.equals(author._id)) {
			return res.status(401).json({ error: { message: UNAUTHORIZE_USER } });
		}

		next();
	});
};

module.exports = userVerification;