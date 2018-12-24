
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('tá funcionando');
});


app.listen(PORT, () => {
  console.log(`Acesse atraves de https://localhost:${PORT}`);
});
