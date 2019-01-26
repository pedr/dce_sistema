
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const apiRouter = require('./routers/api.js');
const loginRouter = require('./routers/login.js');
const webRouter = require('./routers/web.js');

const app = express();
const PORT = process.env.PORT || 5000;
const connString = process.argv[2];

app.use(helmet());
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Servidor funcionando, testando deploy automaticando qnd github atualiza');
});

app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/web', webRouter);

app.listen(PORT, () => {
  console.log(`Acesse atraves de http://localhost:${PORT}`);
});

module.exports = connString;
