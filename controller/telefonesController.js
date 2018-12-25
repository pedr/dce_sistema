
const pool = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const client = await pool.connect();
    const queryStr = 'SELECT * FROM telefone';
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
    const queryStr = 'SELECT * FROM aluno WHERE telefone_id = $1';
    const result = await client.query(queryStr, [id]);
    client.release();
    const results = result.rows;
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.save = async (req, res) => {
  try {
    const { pessoaId, numero } = req.body;
    const client = await pool.connect();
    const queryStr = 'INSERT INTO telefone (pessoa_id, numero) VALUES ($1, $2) RETURNING *';
    const result = await client.query(queryStr, [pessoaId, numero]);
    const results = result.rows[0];
    client.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
