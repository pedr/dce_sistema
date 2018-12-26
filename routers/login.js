
const router = require('express').Router();

const controller = require('../controller/loginController.js');

router.post('/', controller.verify);

module.exports = router;
