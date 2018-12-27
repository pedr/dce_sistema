
const router = require('express').Router();

const controller = require('../../controller/turmasController.js');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.save);

module.exports = router;
