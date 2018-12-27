
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM pessoa';
    const result = await db.plainQuery(queryStr);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStr = 'SELECT * FROM pessoa WHERE pessoaId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.save = async (req, res) => {
  try {
    const { nome, sexo, email } = req.body;
    const client = await pool.connect();
    const queryStr = 'INSERT INTO pessoa (nome, sexo, email) VALUES ($1, $2, $3) RETURNING *';
    const result = await client.query(queryStr, [nome, sexo, email]);
    client.release();
    const results = result.rows[0];
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
