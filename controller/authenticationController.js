
const jwt = require('jsonwebtoken');

const controller = {};

controller.verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.send('algum erro');
  }

  const parts = authorization.split(' ');

  if (!parts.length === 2) {
    return res.send('algum erro');
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.send('algum erro');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.send('algum erro');
    }
    req.userId = decoded.id;
    return next();
  });
  return null;
};

module.exports = controller;
