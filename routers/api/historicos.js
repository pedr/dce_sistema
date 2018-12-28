
const router = require('express').Router();

const controller = require('../../controller/historicosController.js');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

module.exports = router;
