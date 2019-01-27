
const router = require('express').Router();

const controller = require('../controller/loginController.js');

router.get('/', (req, res) => res.redirect('/login.html'));
router.post('/in', controller.verify);

module.exports = router;
