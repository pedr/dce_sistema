
const router = require('express').Router();
const controller = require('../controller/webController.js');

router.use('/', controller.isLogged);
router.get('/', controller.home);

module.exports = router;
