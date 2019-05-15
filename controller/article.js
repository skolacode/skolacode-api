const { validationResult } = require('express-validator/check');

const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

const Article = require('../models/article');
const Feedback = require('../models/feedback');
const ArticleLike = require('../models/articleLike');

// GET ARTICLES
const getArticles = (req, res) => {
	Article.find({}, [], {
		sort: {
			createdAt: -1,
		}
	}, (err, articles) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
		}
		res.json(articles);
	}).populate('author');
};

// GET PUBLISHED ARTICLES
const getPublishedArticles = (req, res) => {
	Article.find({
		isPublished: true,
	}, ['-content'], {
		sort: {
			createdAt: -1,
		}
	}, (err, articles) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
		}
		res.json(articles);
	}).populate('author');
};

// GET PUBLISHED ARTICLES
const getUnpublishedArticles = (req, res) => {
	Article.find({
		isPublished: false,
	}, ['-content'], {
		sort: {
			createdAt: -1,
		}
	}, (err, articles) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
		}
		res.json(articles);
	}).populate('author');
};

// GET ARTICLE
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
	const { title, description, headerImgUrl, content, tags, isPublished } = req.body;

	Article.create({
		title,
		description,
		headerImgUrl,
		content,
		tags,
		isPublished,
		author: user._id,
	}, (err, article) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.json(article);
	});
};

// UPDATE ARTICLE
const updateArticle = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { id } = req.params;
	const { title, description, headerImgUrl, content, tags, isPublished } = req.body;

	Article.findByIdAndUpdate(id, {
		title,
		description,
		headerImgUrl,
		content,
		tags,
		isPublished,
	}, (err, article) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		res.json(article);
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


// UPDATE ARTICLE STATUS
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

		res.json(article);
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

// GET LIKE
const getLike = (req, res) => {
	const { user, params: { id } } = req;
	const { _id } = user;

	ArticleLike.findOne({
		author: _id,
		article: id,
	}, (err, like) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		if (!like) {
			return res.json({ isLike: false });
		}

		res.json({ isLike: true });
	});
};

// CREATE LIKE
const createLike = (req, res) => {
	const { user, params: { id } } = req;
	const { _id } = user;

	ArticleLike.findOne({
		author: _id,
		article: id,
	}, (err, like) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		if (like) {
			return res.status(403).json({ error: { message: 'USER ALREADY LIKED THE POST' } });
		}

		ArticleLike.create({
			author: _id,
			article: id,
		}, (e, l) => {
			if (e) {
				return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
			}

			Article.findById(id, (articleErr, article) => {
				if (articleErr) {
					return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
				}
				let { likesCount } = article;
				Article.findByIdAndUpdate(id, {
					likesCount: likesCount += 1,
				}, (updateErr) => {
					if (updateErr) {
						return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
					}
				});
			});

			res.json(l);
		});
	});
};

// DELETE LIKE
const deleteLike = (req, res) => {
	const { user, params: { id } } = req;
	const { _id } = user;

	ArticleLike.findOneAndRemove({
		author: _id,
		article: id,
	}, (err) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}

		Article.findById(id, (articleErr, article) => {
			if (articleErr) {
				return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
			}
			let { likesCount } = article;
			Article.findByIdAndUpdate(id, {
				likesCount: likesCount -= 1,
			}, (updateErr) => {
				if (updateErr) {
					return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
				}
			});
		});

		res.json({ meesage: 'SUCCESS' });
	});
};

module.exports = {
	getArticles,
	getPublishedArticles,
	getUnpublishedArticles,
	getArticle,
	createArticle,
	updateArticle,
	deleteArticle,
	updateArticleStatus,
	getArticleFeedbacks,
	getLike,
	createLike,
	deleteLike,
};