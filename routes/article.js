const express = require('express');
const { check } = require('express-validator/check');

const controller = require('../controller/article');
const middleware = require('../middlewares');

const router = express.Router();


// GET ARTICLES
router.get('/', controller.getArticles);

// GET ARTICLE
router.get('/:id', controller.getArticle);

// CREATE ARTICLE
router.post('/', [
	middleware.userAuthentication,
	check('title').not().isEmpty(),
	check('headerImgUrl').not().isEmpty(),
	check('content').not().isEmpty(),
], controller.createArticle);

// UPDATE ARTICLE
router.patch('/:id', [
	middleware.userAuthentication,
	middleware.userArticleVerification,
	check('title').isString(),
	check('headerImgUrl').isString(),
	check('content').isString(),
	check('tags').isArray(),
	check('isPublished').isBoolean(),
], controller.updateArticle);

// DELETE ARTICLE
router.delete('/:id',[
	middleware.userAuthentication,
	middleware.userArticleVerification,
], controller.deleteArticle);

// UPDATE ARTICLE STATUS
router.patch('/:id/status', [
	middleware.userAuthentication,
	middleware.userRoleVerification,
	check('status').isString(),
], controller.updateArticleStatus);

// GET ARTICLE FEEDBACKS
router.get('/:id/feedbacks', controller.getArticleFeedbacks);

module.exports = router;
