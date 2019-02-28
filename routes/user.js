const express = require('express');
const router = express.Router();

const middleware = require('../middlewares');

/* GET home page. */
router.get('/profile', middleware.userAuthentication, (req, res) => {
	res.json(req.user);
});

module.exports = router;
