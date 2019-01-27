
// !!! arrumar algum jeito de verificar apenas pelo JWT

const util = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../database/db.js');
const { getCookies } = require('./utils.js');
const { addPessoa } = require('./pessoasController.js');
const { addGerente } = require('./gerentesController.js');

const controller = {};

async function findGerente(login) {
  try {
    const queryStr = 'SELECT * FROM gerente WHERE login = $1';
    const result = await db.queryWithArgs(queryStr, [login]);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function insertSession(gerenteId, token) {
  try {
    const queryStr = 'INSERT INTO session (registroId, token) values ($1, $2)';
    const result = await db.queryWithArgs(queryStr, [gerenteId, token]);
    return result;
  } catch (err) {
    console.error('create session \n', err);
    return null;
  }
}

function verifySenha(senha) {
  const hash = crypto.createHash('sha512');
  hash.update(senha);
  return hash.digest('hex');
}

async function createToken() {
  const promiseRandomBytes = util.promisify(crypto.randomBytes);
  try {
    const sessionBuffer = await promiseRandomBytes(128);
    const sessionStr = sessionBuffer.toString('hex');
    return sessionStr;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function loggingTime(gerenteId) {
  try {
    const queryStr = 'INSERT INTO registro (gerenteId) values ($1) RETURNING *';
    const results = await db.queryWithArgs(queryStr, [gerenteId]);

    if (results === null) {
      console.error('nao conseguiu hora do logging');
    }

    const result = results[0];

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

controller.verify = async (req, res) => {
  // 30min
  const EXPIRING_TIME = 1800000;
  const { login, senha } = req.body;
  try {
    const gerentes = await findGerente(login);
    const gerente = gerentes[0];
    if (gerente === null) {
      res.redirect('/login');
      return;
    }

    const senhaLogin = verifySenha(senha);
    if (gerente.senha !== senhaLogin) {
      res.redirect('/login');
      return;
    }

    const registro = await loggingTime(gerente.gerenteid);
    if (registro === null) {
      console.error('não foi possivel salvar o log no registro');
      res.redirect('/login');
      return;
    }

    const session = await createToken();
    const worked = await insertSession(registro.registroid, session);
    if (worked === null) {
      res.redirect('/login');
      return;
    }

    const token = jwt.sign({ id: gerente.gerenteid }, process.env.SECRET, {
      expiresIn: 1800,
    });

    res.cookie('token', session, { httpOnly: true, maxAge: EXPIRING_TIME });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.logout = async (req, res) => {
  try {
    const { token } = getCookies(req.headers.cookie);
    const selectQry = 'SELECT * FROM session WHERE token = $1';
    const selectResult = await db.queryWithArgs(selectQry, [token]);
    const { registroid } = selectResult[0];

    const updateQry = 'UPDATE registro SET datahorasaida = now() WHERE registroid = $1';
    await db.queryWithArgs(updateQry, [registroid]);

    const queryStr = 'DELETE FROM session WHERE registroid = $1';
    await db.queryWithArgs(queryStr, [registroid]);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('erro na hora de deslogar');
  }
};

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
    const cryptSenha = verifySenha(senha);

    const gerente = await addGerente(pessoaid, login, cryptSenha, superUser);

    res.send(gerente);
    return;
  } catch (err) {
    res.send(err);
  }
};

module.exports = controller;
