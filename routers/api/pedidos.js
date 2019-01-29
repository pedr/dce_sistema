
const router = require('express').Router();

const controller = require('../../controller/pedidosController.js');
/*
 *
 * /api/search?search=asdf
 * /api/date?inital=YYYYMMDD?final=YYYYMMDD?format=[sum|all]
 * final não necessaria, considera dia atual se não presente
 * format pode ser SUM ou ALL,
 *  sum soma os valores,
 *    retornado copiacorreta, copiaerrada, datainital, datafinal
 *  all retorna os pedidos inteiros
*/

router.get('/', controller.getAll);
router.get('/search', controller.getByName);
router.get('/date', controller.byDate);
router.get('/:id', controller.getOne);
router.post('/', controller.add);

module.exports = router;
