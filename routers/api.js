
const router = require('express').Router();

const turmasRouter = require('./api/turmas.js');
const alunosRouter = require('./api/alunos.js');
const pessoasRouter = require('./api/pessoas.js');
const gerentesRouter = require('./api/gerentes.js');
const registrosRouter = require('./api/registros.js');
const pedidosRouter = require('./api/pedidos.js');
const authenticationRouter = require('../middleware/authentication.js');

router.use('/', authenticationRouter);
router.use('/turmas', turmasRouter);
router.use('/pessoas', pessoasRouter);
router.use('/alunos', alunosRouter);
router.use('/gerentes', gerentesRouter);
router.use('/registros', registrosRouter);
router.use('/pedidos', pedidosRouter);

module.exports = router;
