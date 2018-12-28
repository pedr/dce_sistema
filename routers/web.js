
const router = require('express').Router();
const controller = require('../controller/webController.js');

router.use('/', controller.isLogged);

module.exports = router;
