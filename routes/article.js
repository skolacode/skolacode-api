const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const { userAuthentication, userVerification, userRoleVerification } = require('../middlewares');
const Article = require('../models/article');
const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

// GET ARTICLES
router.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
		}
		res.json(articles);
	});
});

// GET ARTICLE
router.get('/:id', (req, res) => {
	const { id } = req.params;
	Article.findById(id).populate('author').exec(
		(err, article) => {
			if (err) {
				return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }}); 
			}
			res.json(article);
		}
	);
});

// CREATE ARTICLE
router.post('/', [
	userAuthentication,
	check('title').not().isEmpty(),
	check('headerImgUrl').not().isEmpty(),
	check('content').not().isEmpty(),
], (req, res) => {
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
});

// UPDATE ARTICLE
router.patch('/:id', [
	userAuthentication,
	userVerification,
	check('title').isString(),
	check('headerImgUrl').isString(),
	check('content').isString(),
	check('tags').isArray(),
	check('isPublished').isBoolean(),
], (req, res) => {
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
});

// DELETE ARTICLE
router.delete('/:id', [userAuthentication, userVerification], (req, res) => {
	const { id } = req.params;

	Article.findByIdAndDelete(id, (err) => {
		if (err) {
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR } });
		}
		res.json({ message: 'SUCCESS' });
	});
});

router.patch('/status/:id', [
	userAuthentication,
	userRoleVerification,
	check('status').isString(),
], (req, res) => {
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
});

module.exports = router;
