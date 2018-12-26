
const pool = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const client = await pool.connect();
    const queryStr = 'SELECT * FROM aluno';
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
    const queryStr = 'SELECT * FROM aluno WHERE alunoId = $1';
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
    const { alunoId, turmaId, matricula } = req.body;
    const client = await pool.connect();
    const queryStr = 'INSERT INTO aluno (alunoId, turmaId, matricula) VALUES ($1, $2, $3) RETURNING *';
    const result = await client.query(queryStr, [alunoId, turmaId, matricula]);
    client.release();
    const results = result.rows[0];
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
