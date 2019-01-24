
const router = require('express').Router();

const authentication = require('../controller/authenticationController.js');

router.use('/', authentication.verifyJWT);

module.exports = router;
