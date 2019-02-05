
const db = require('../database/db.js');

const controller = {};

controller.hasAccess = async (req, res, next) => {
  try {
    const gerenteId = req.userId;
    const queryStr = 'SELECT superUser FROM gerente WHERE gerenteId = $1';
    const result = await db.queryWithArgs(queryStr, [gerenteId]);

    if (result[0].superuser) {
      next();
      return;
    }
    res.status(401).send();
  } catch (err) {
    console.error(err);
    res.status(401).send();
  }
};

controller.superUserPanel = async (req, res) => {
  res.send('apenas superUsers deviam ver isso');
};

module.exports = controller;
