const { validationResult } = require('express-validator/check');

const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

const Feedback = require('../models/feedback');

// CREATE FEEDBACK
const createFeedback = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { user, body } = req;
	const { content, articleId } = body;

	Feedback.create({
		content,
		article: articleId,
		author: user._id,
	}, (err, feedback) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		Feedback.findById(feedback._id, (e, f) => {
			if (e) {
				return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
			}
			res.json(f);
		}).populate('author');
	});
};

// DELETE FEEDBACK
const deleteFeddback = (req, res) => {
	const { id } = req.params;

	Feedback.findByIdAndDelete(id, (err) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}
		res.json({ message: 'SUCCESS' });
	});
};

module.exports = {
	createFeedback,
	deleteFeddback,
};