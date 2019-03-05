const { validationResult } = require('express-validator/check');

const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

const User = require('../models/user');
const Feedback = require('../models/feedback');

const updateUser = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	
	const { role, githubID } = req.user;
	const { _id } = req.user;
	
	User.findByIdAndUpdate(_id, {
		...req.body,
		role,
		githubID,
	}, (err, user) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}
		return res.json(user);
	});
};

// GET USER FEEDBACKS
const getUserFeedbacks = (req, res) => {
	const { user } = req;

	Feedback.find({
		author: user._id,
	}, (err, feedbacks) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.json(feedbacks);
	}).populate('article');
};

module.exports = {
	updateUser,
	getUserFeedbacks,
};