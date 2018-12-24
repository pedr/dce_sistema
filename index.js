
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteneded: true }));

app.get('/:par?', (req, res) => {
  const { par } = req.params;
  res.send(`tá funcionando, parametro enviado: ${par}`);
});

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});
