
const db = require('../database/db.js');
const { getCookies } = require('./utils.js');

const controller = {};

controller.superUser = async (req, res, next) => {
  const { token } = getCookies(req.headers.cookie);
  try {
    const queryStr = 'SELECT * FROM session WHERE token = $1';
    const results = await db.queryWithArgs(queryStr, [token]);
    const { registroid } = results[0];

    const registroQuery = 'SELECT * FROM registro WHERE registroid = $1';
    const registroResults = await db.queryWithArgs(registroQuery, [registroid]);

    const { gerenteid } = registroResults[0];
    const gerenteQuery = 'SELECT * FROM gerente WHERE gerenteid = $1';
    const gerenteResults = await db.queryWithArgs(gerenteQuery, [gerenteid]);

    const gerente = gerenteResults[0];

    if (gerente.superuser === true) {
      next();
      return;
    }
    res.redirect('/');
    return;
  } catch (err) {
    console.error(err);
  }
};

controller.home = async (req, res) => {
  res.send('Página exclusiva para superusers');
};

module.exports = controller;
