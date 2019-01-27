
const router = require('express').Router();

const controller = require('../../controller/pedidosController.js');

router.get('/', controller.getAll);
router.get('/search', controller.getByName);
router.get('/:id', controller.getOne);
router.post('/', controller.add);

module.exports = router;
