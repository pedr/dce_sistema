
const router = require('express').Router();

const { controller } = require('../../controller/pessoasController.js');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.add);

module.exports = router;
