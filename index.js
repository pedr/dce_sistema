
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const turmasRouter = require('./routers/api/turmas.js');
const alunosRouter = require('./routers/api/alunos.js');
const pessoasRouter = require('./routers/api/pessoas.js');
const telefonesRouter = require('./routers/api/telefones.js');
const gerentesRouter = require('./routers/api/gerentes.js');
const loginRouter = require('./routers/login.js');
const apiRouter = require('./routers/api.js');

const app = express();
const PORT = process.env.PORT || 5000;
const connString = process.argv[2];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/api/turmas', turmasRouter);
app.use('/api/pessoas', pessoasRouter);
app.use('/api/alunos', alunosRouter);
app.use('/api/telefones', telefonesRouter);
app.use('/api/gerentes', gerentesRouter);

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});

module.exports = connString;
