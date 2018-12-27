
const router = require('express').Router();

const controller = require('../controller/loginController.js');

router.post('/', controller.verify);
router.get('/', (req, res) => res.redirect('/login.html'));

module.exports = router;
