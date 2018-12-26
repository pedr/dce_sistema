
const pool = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const client = await pool.connect();
    const queryStr = 'SELECT * FROM turma';
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
    const queryStr = 'SELECT * FROM turma WHERE turmaId = $1';
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
    const { nome } = req.body;
    const client = await pool.connect();
    const queryStr = 'INSERT INTO turma (nome) VALUES ($1)';
    const result = await client.query(queryStr, [nome]);
    client.release();
    const results = result.rows;
    res.json(results);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
