
// !!! arrumar algum jeito de verificar apenas pelo JWT

const util = require('util');
const crypto = require('crypto');
const db = require('../database/db.js');

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
    const deleteQry = 'DELETE FROM session WHERE gerenteId = $1';
    await db.queryWithArgs(deleteQry, [gerenteId]);
    const queryStr = 'INSERT INTO session (gerenteId, token) values ($1, $2)';
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

async function loggingTime(registroId) {
  try {
    const queryStr = 'INSERT INTO registro (gerenteId) values ($1)';
    const result = await db.queryWithArgs(queryStr, [registroId]);

    if (result === null) {
      console.error('nao conseguiu hora do logging');
    }

    return true;
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

    const session = await createToken();
    const worked = await insertSession(gerente.gerenteid, session);
    if (worked === null) {
      res.redirect('/login');
      return;
    }
    const logged = await loggingTime(gerente.gerenteid);
    if (logged === false) {
      console.error('não foi possivel salvar o log no registro');
    }

    res.cookie('token', session, { httpOnly: true, maxAge: EXPIRING_TIME });
    res.json('conseguiu logar');
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.logout = async (req, res) => {
  try {

    res.send('não tá pronto ainda');
  } catch (err) {
    console.error(err);
    res.send('erro na hora de deslogar');
  }
};

module.exports = controller;
