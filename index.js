
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const turmasRouter = require('./routers/turmas.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/turmas', turmasRouter);

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});
