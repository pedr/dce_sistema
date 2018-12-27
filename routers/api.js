
const router = require('express').Router();
const controller = require('../controller/apiController.js');

router.use('/', controller.checkSession);

module.exports = router;
