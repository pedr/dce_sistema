
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const turmasRouter = require('./routers/turmas.js');
const alunosRouter = require('./router/alunos.js');
const pessoasRouter = require('./router/pessoas.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/turmas', turmasRouter);
app.use('/pessoas', pessoasRouter);
app.use('/alunos', alunosRouter);

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});
