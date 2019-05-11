const express = require('express');
const { check } = require('express-validator/check');

const controller = require('../controller/feedback');
const middleware = require('../middlewares');

const router = express.Router();

// CREATE FEEDBACK
router.post('/', [
	middleware.userAuthentication,
	check('content').isString(),
	check('articleId').isString(),
], controller.createFeedback);

// DELETE FEEDBACK
router.delete('/:id', [
	middleware.userAuthentication,
	middleware.userFeedbackVerification,
], controller.deleteFeddback);

module.exports = router;