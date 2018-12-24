
const crypto = require('crypto');
const pool = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const client = await pool.connect();
    const queryStr = 'SELECT * FROM gerente';
    const result = await client.query(queryStr);
    client.release();
    const results = result.rows;
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const queryStr = 'SELECT * FROM gerente WHERE gerente_id = $1';
    const result = await client.query(queryStr, [id]);
    client.release();
    const results = result.rows;
    res.json(results);
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

controller.save = async (req, res) => {
  try {
    const { gerenteId, login, senha, superUser } = req.body;
    const client = await pool.connect();
    const queryStr = 'INSERT INTO gerente (gerente_id, login, senha, superUser) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await client.query(queryStr, [gerenteId, login, senha, superUser]);
    client.release();
    const results = result.rows[0];
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
