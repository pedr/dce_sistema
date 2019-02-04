
const jwt = require('jsonwebtoken');

const controller = {};

controller.verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401);
  }

  const parts = authorization.split(' ');

  if (!parts.length === 2) {
    return res.status(401);
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401);
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401);
    }
    req.userId = decoded.id;
    return next();
  });
  return null;
};

module.exports = controller;
