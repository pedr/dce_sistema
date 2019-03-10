
const jwt = require('jsonwebtoken');
const db = require('../database/db.js');
const { encryptarSenha } = require('./utils.js');

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
  const { login, senha } = req.body;
  try {
    const gerentes = await findGerente(login);
    const gerente = gerentes[0];
    if (gerente === undefined) {
      res.status(200).send();
      return;
    }

    const senhaLogin = encryptarSenha(senha);
    if (gerente.senha !== senhaLogin) {
      res.stauts(200).send();
      return;
    }

    const registro = await loggingTime(gerente.gerenteid);
    if (registro === null) {
      console.error('não foi possivel salvar o log no registro');
      res.status(200).send();
      return;
    }

    const token = jwt.sign({ id: gerente.gerenteid }, process.env.SECRET, {
      expiresIn: 1800,
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

module.exports = controller;
