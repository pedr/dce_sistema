
const router = require('express').Router();

const pessoasRouter = require('./api/pessoas.js');
const gerentesRouter = require('./api/gerentes.js');
const registrosRouter = require('./api/registros.js');
const pedidosRouter = require('./api/pedidos.js');
const authenticationRouter = require('../middleware/authentication.js');
const superUserRouter = require('./api/superUser.js');

router.use('/', authenticationRouter);
router.use('/pessoas', pessoasRouter);
router.use('/gerentes', gerentesRouter);
router.use('/registros', registrosRouter);
router.use('/pedidos', pedidosRouter);
router.use('/superuser', superUserRouter);

module.exports = router;
