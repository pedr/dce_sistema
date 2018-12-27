
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM telefone';
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
    const queryStr = 'SELECT * FROM aluno WHERE telefoneId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.save = async (req, res) => {
  try {
    const { pessoaId, numero } = req.body;
    const queryStr = 'INSERT INTO telefone (pessoaId, numero) VALUES ($1, $2) RETURNING *';
    const result = await db.queryWithArgs(queryStr, [pessoaId, numero]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
