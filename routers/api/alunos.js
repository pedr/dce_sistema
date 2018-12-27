
const router = require('express').Router();

const controller = require('../../controller/alunosController.js');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.save);

module.exports = router;
