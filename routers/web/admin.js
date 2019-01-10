
const router = require('express').Router();

const controller = require('../../controller/adminController.js');

router.use('/', controller.superUser);
router.get('/', controller.home);

module.exports = router;
