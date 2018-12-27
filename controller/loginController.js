
// !!! arrumar algum jeito de verificar apenas pelo JWT

const util = require('util');
const crypto = require('crypto');
const pool = require('../database/db.js');

const controller = {};

async function findGerente(login) {
  try {
    const client = await pool.connect();
    const queryStr = 'SELECT * FROM gerente WHERE login = $1';
    const results = await client.query(queryStr, [login]);
    client.release();

    if (results.rows) {
      return results.rows[0];
    }
    return null;
  } catch (err) {
    console.error('findGerente \n', err);
    return null;
  }
}

async function insertSession(gerenteId, token) {
  try {
    const client = await pool.connect();
    const deleteQry = 'DELETE FROM session WHERE gerenteId = $1';
    await client.query(deleteQry, [gerenteId]);
    const queryStr = 'INSERT INTO session (gerenteId, token) values ($1, $2)';
    const results = await client.query(queryStr, [gerenteId, token]);
    console.log(results);
    const result = results.rows[0];
    client.release();
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

controller.verify = async (req, res) => {
  const { login, senha } = req.body;
  try {
    const gerente = await findGerente(login);
    if (gerente === null) return;

    const senhaLogin = verifySenha(senha);
    if (gerente.senha !== senhaLogin) {
      res.json('error');
      return;
    }
    const session = await createToken();
    console.log(gerente);
    const worked = await insertSession(gerente.gerenteid, session);
    if (worked === null) {
      res.json('error');
      return;
    }
    res.cookie('token', session);
    res.json('conseguiu logar');
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
