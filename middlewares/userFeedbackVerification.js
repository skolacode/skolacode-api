const { INTERNAL_SERVER_ERROR, UNAUTHORIZE_USER } = require('../constants/errors');

const Feedback = require('../models/feedback');

const userFeedbackVerification = (req, res, next) => {
	const { user, params } = req;
	const { id } = params;

	Feedback.findById(id, 'author', (err, feedback) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		const { author } = feedback;
		if (!user._id.equals(author._id)) {
			return res.status(401).json({ error: { message: UNAUTHORIZE_USER } });
		}

		next();
	});
};

module.exports = userFeedbackVerification;