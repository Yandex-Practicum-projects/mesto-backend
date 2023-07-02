const jwt = require('jsonwebtoken');
const InvalidAuthentication = require('../errors/invalid-authentication');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new InvalidAuthentication('Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new InvalidAuthentication('Необходима авторизация');
  }
  req.user = payload;
  next();
};
