
const router = require('express').Router();

const turmasRouter = require('./api/turmas.js');
const alunosRouter = require('./api/alunos.js');
const pessoasRouter = require('./api/pessoas.js');
const telefonesRouter = require('./api/telefones.js');
const gerentesRouter = require('./api/gerentes.js');
const registrosRouter = require('./api/registros.js');
const historicosRouter = require('./api/historicos.js');

router.use('/turmas', turmasRouter);
router.use('/pessoas', pessoasRouter);
router.use('/alunos', alunosRouter);
router.use('/telefones', telefonesRouter);
router.use('/gerentes', gerentesRouter);
router.use('/registros', registrosRouter);
router.use('/historicos', historicosRouter);

module.exports = router;
