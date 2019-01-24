
const crypto = require('crypto');
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM gerente';
    const result = await db.plainQuery(queryStr);
    for (const gerente of result) {
      delete gerente.senha;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStr = 'SELECT * FROM gerente WHERE gerenteId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    for (const gerente of result) {
      delete gerente.senha;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.encrypt = (req, res, next) => {
  const { senha } = req.body;
  const hash = crypto.createHash('sha512');
  hash.update(senha);
  const hashHex = hash.digest('hex');
  req.body.senha = hashHex;
  next();
};

async function addGerente(gerenteId, login, senha, superUser = false) {
  const queryStr = 'INSERT INTO gerente (gerenteId, login, senha, superUser) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await db.queryWithArgs(queryStr, [gerenteId, login, senha, superUser]);

  return { ok: true, content: result };
}

controller.save = async (req, res) => {
  try {
    const {
      gerenteId, login, senha, superUser,
    } = req.body;
    const result = await addGerente(gerenteId, login, senha, superUser);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = {
  controller,
  addGerente,
};
