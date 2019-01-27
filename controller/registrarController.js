
const Joi = require('joi');

const { encryptarSenha } = require('./utils.js');
const { addPessoa } = require('./pessoasController.js');
const { addGerente } = require('./gerentesController.js');

const controller = {};

controller.registrar = async (req, res) => {
  const schema = Joi.object().keys({
    nome: Joi.string().regex(/^[a-zA-Z ]{4,50}$/).required(),
    email: Joi.string().email().required(),
    login: Joi.string().alphanum().min(3).max(20).required(),
    senha: Joi.string().alphanum().min(6).max(20).required(),
    superUser: Joi.boolean(),
    confirmarSenha: Joi.string().alphanum().min(6).max(20).required(),
    sexo: Joi.string().regex(/^[mfMF]$/),
  });

  try {
    const data = req.body;
    const validate = Joi.validate(data, schema);

    if (validate.error !== null) {
      res.json(validate.error, 'faltou algum dado, nome, email, sexo, senha confirmarSenha');
      return;
    }

    const {
      nome, email, login, senha, confirmarSenha, superUser, sexo,
    } = data;

    if (senha !== confirmarSenha) {
      res.send('senha invalida');
      return;
    }

    const pessoa = await addPessoa(nome, email, sexo);

    if (!pessoa.ok) {
      res.send('não conseguiu registrar pessoa');
      return;
    }

    const { pessoaid } = pessoa.content;
    const cryptSenha = encryptarSenha(senha);

    const gerente = await addGerente(pessoaid, login, cryptSenha, superUser);

    res.send(gerente);
    return;
  } catch (err) {
    res.send(err);
  }
};

module.exports = controller;
