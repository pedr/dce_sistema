
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
//const helmet = require('helmet');
const apiRouter = require('./routers/api.js');
const loginRouter = require('./routers/login.js');
const registrarRouter = require('./routers/registrar.js');

const app = express();
const PORT = process.env.PORT || 5000;
const connString = process.argv[2];

//app.use(helmet());
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//ESTE TRECHO AUTORIZA REQUISICOES DE DIFERENTES END-POINTS (CROSS ORIGN REQUEST), DESTA FORMA CONSIGO CONSUMIR
//A API NO MEU AMBIENTE DE DESENVOLVIMENTO, AO COLOCAR O APP EM PRODUÇÃO NUMA VERSÃO ESTÁVEL REMOVER TRECHO ABAIXO.

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
   // res.send('cors problem fixed:)');
 // next();
});
app.get('/', (req, res) => {
  res.send('Servidor funcionando, testando deploy automaticando qnd github atualiza');
   // res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    //res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    //res.send('cors problem fixed:)');
});

app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/registrar', registrarRouter);

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});

module.exports = connString;
