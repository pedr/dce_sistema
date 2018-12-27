
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM ALUNO';
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
    const queryStr = 'SELECT * FROM aluno WHERE alunoId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.save = async (req, res) => {
  try {
    const { alunoId, turmaId, matricula } = req.body;
    const queryStr = 'INSERT INTO aluno (alunoId, turmaId, matricula) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.queryWithArgs(queryStr, [alunoId, turmaId, matricula]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
