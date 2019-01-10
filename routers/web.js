
const router = require('express').Router();
const controller = require('../controller/webController.js');
const adminRouter = require('./web/admin.js');

router.use('/', controller.isLogged);
router.get('/', controller.home);
router.use('/admin', adminRouter);

module.exports = router;
