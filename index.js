
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const turmasRouter = require('./routers/turmas.js');
const alunosRouter = require('./routers/alunos.js');
const pessoasRouter = require('./routers/pessoas.js');
const telefonesRouter = require('./routers/telefones.js');
const gerentesRouter = require('./routers/gerentes.js');

const app = express();
const PORT = process.env.PORT || 5000;
const connString = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.use('/turmas', turmasRouter);
app.use('/pessoas', pessoasRouter);
app.use('/alunos', alunosRouter);
app.use('/telefones', telefonesRouter);
app.use('/gerentes', gerentesRouter);

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});

module.exports = connString;
