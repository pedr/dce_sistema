//A API NO MEU AMBIENTE DE DESENVOLVIMENTO, AO COLOCAR O APP EM PRODUÇÃO NUMA VERSÃO ESTÁVEL REMOVER TRECHO ABAIXO.

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // res.setHeader('Access-Control-Allow-Origin', '*');
  //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  //   res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  //   res.send('cors problem fixed:)');
  next();
});
app.get('/', (req, res) => {
  res.send('Servidor funcionando, testando deploy automaticando qnd github atualiza');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    // res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send('cors problem fixed:)');
});

app.use('/api', apiRouter);
