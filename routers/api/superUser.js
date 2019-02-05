
const router = require('express').Router();

const controller = require('../../controller/superUserController.js');

router.use('/', controller.hasAccess);
router.get('/', controller.superUserPanel);

module.exports = router;
