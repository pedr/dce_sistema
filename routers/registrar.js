
const router = require('express').Router();

const controller = require('../controller/registrarController.js');

router.get('/', (req, res) => res.send('mandar post para essa rota com nome, email, login, senha, verificarSenha, superUser, sexo'));
router.post('/', controller.registrar);

module.exports = router;

