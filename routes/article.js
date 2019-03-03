const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const middlewares = require('../middlewares');
const Article = require('../models/article');
const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

// GET ARTICLE
router.get('/:id', middlewares.userAuthentication, (req, res) => {
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
router.post('/', middlewares.userAuthentication, [
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
			return res.status(500).json({ error: { message: INTERNAL_SERVER_ERROR }});
		}

		res.redirect(`/api/v1/article/${article._id}`);
	});
});

module.exports = router;
