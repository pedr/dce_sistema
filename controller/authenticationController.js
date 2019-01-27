
const jwt = require('jsonwebtoken');

const controller = {};

controller.verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.send('sem autorization no headers');
  }

  const parts = authorization.split(' ');

  if (!parts.length === 2) {
    return res.send('token formato invalido');
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.send('bearer nao encontrado, token malformated');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.send('error token invalido');
    }
    req.userId = decoded.id;
    return next();
  });
  return null;
};

module.exports = controller;
