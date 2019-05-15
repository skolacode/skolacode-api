const express = require('express');
const { check } = require('express-validator/check');

const controller = require('../controller/article');
const middleware = require('../middlewares');

const router = express.Router();


// GET ARTICLES
router.get('/', controller.getArticles);

// GET PUBLISHED ARTICLES
router.get('/published', controller.getPublishedArticles);

// GET UNPUBLISHED ARTICLES
router.get('/unpublished', controller.getUnpublishedArticles);

// GET ARTICLE
router.get('/:id', controller.getArticle);

// CREATE ARTICLE
router.post('/', [
	middleware.userAuthentication,
	check('headerImgUrl').not().isEmpty(),
	check('title').not().isEmpty(),
	check('description').not().isEmpty(),
	check('content').not().isEmpty(),
], controller.createArticle);

// UPDATE ARTICLE
router.patch('/:id', [
	middleware.userAuthentication,
	middleware.userArticleVerification,
	check('title').isString(),
	check('description').isString(),
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

// GET LIKED ARTICLE
router.get('/:id/like', middleware.userAuthentication, controller.getLike);

// CREATE LIKED ARTICLE
router.post('/:id/like',middleware.userAuthentication, controller.createLike);

// DELETE LIKED ARTICLE
router.delete('/:id/like', middleware.userAuthentication, controller.deleteLike);

module.exports = router;