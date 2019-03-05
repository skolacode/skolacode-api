const { validationResult } = require('express-validator/check');

const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

const Article = require('../models/article');
const Feedback = require('../models/feedback');

// GET ARTICLES
const getArticles = (req, res) => {
	Article.find({}, (err, articles) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
		}
		res.json(articles);
	});
};

// GET ARTICLES
const getArticle = (req, res) => {
	const { id } = req.params;
	Article.findById(id).populate('author').exec(
		(err, article) => {
			if (err) {
				return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
			}
			res.json(article);
		}
	);
};

// CREATE ARTICLE
const createArticle = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { user } = req;
	const { title, headerImgUrl, content, tags, isPublished } = req.body;

	Article.create({
		title,
		headerImgUrl,
		content,
		tags,
		isPublished,
		author: user._id,
	}, (err, article) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.redirect(`/api/v1/article/${article._id}`);
	});
};

// UPDATE ARTICLE
const updateArticle = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { id } = req.params;
	const { title, headerImgUrl, content, tags, isPublished } = req.body;

	Article.findByIdAndUpdate(id, {
		title,
		headerImgUrl,
		content,
		tags,
		isPublished,
	}, (err, article) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.redirect(`/api/v1/article/${article._id}`);
	});
};


// DELETE ARTICLE
const deleteArticle = (req, res) => {
	const { id } = req.params;

	Article.findByIdAndDelete(id, (err) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}
		res.json({ message: 'SUCCESS' });
	});
};


// UPDATE ARTICLE
const updateArticleStatus = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { status } = req.body;
	const { id } = req.params;

	Article.findByIdAndUpdate(id, {
		status,
	}, (err, article) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.redirect(`/api/v1/article/${article._id}`);
	});
};

// GET ARTICLE FEEDBACKS
const getArticleFeedbacks = (req, res) => {
	const { id } = req.params;

	Feedback.find({
		article: id,
	}, (err, feedbacks) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.json(feedbacks);
	}).populate('author');
};

module.exports = {
	getArticles,
	getArticle,
	createArticle,
	updateArticle,
	deleteArticle,
	updateArticleStatus,
	getArticleFeedbacks,
};