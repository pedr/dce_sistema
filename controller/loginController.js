
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
    if (gerente === null) {
      res.redirect('/login');
      return;
    }

    const senhaLogin = encryptarSenha(senha);
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

    const token = jwt.sign({ id: gerente.gerenteid }, process.env.SECRET, {
      expiresIn: 1800,
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.logout = async (req, res) => {
  try {
    /*
    const { userId } = req;
    console.log(userId);
    const getRegistro = 'SELECT * FROM registro WHERE gerenteid = $1
      ORDER BY datahoraentrada DESC LIMIT 1';
    const registroid = await db.queryWithArgs(getRegistro, [userId]);
    const updateQry = 'UPDATE registro SET datahorasaida = now() WHERE registroid = $1';
    await db.queryWithArgs(updateQry, [registroid]);
    */

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('erro na hora de deslogar');
  }
};

module.exports = controller;
