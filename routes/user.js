const express = require('express');
const { check } = require('express-validator/check');

const controller = require('../controller/user');

const router = express.Router();

// GET USER
router.get('/profile', (req, res) => {
	res.json(req.user);
});

// UPDATE USER
router.patch('/profile', [
	check('username').isString(),
	check('email').isString(),
	check('displayName').isString(),
	check('avatarUrl').isString(),
	check('bio').isString(),
	check('website').isString(),
	check('github').isString(),
	check('twitter').isString(),
	check('linkedIn').isString(),
], controller.updateUser);

// GET USER FEEDBACKS
router.get('/feedbacks', controller.getUserFeedbacks);

// GET USER LIKES
router.get('/likes', controller.getUserLikes);

// GET USER PUBLISHED ARTICLES
router.get('/articles/published', controller.getUserPublishedArticles);

// GET USER UNPUBLISHED ARTICLES
router.get('/articles/unpublished', controller.getUserUnpublishedArticles);

module.exports = router;
