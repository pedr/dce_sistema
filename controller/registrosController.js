
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM registro';
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
    const queryStr = 'SELECT * FROM registro WHERE registroId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
