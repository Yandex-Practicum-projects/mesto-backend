const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/not-found');

const options = { new: true, runValidators: true };
const handleError = (err, next) => {
  if (err.name === 'CastError') {
    return next(new NotFound('Запрашиваемый пользователь не найден'));
  }
  return next(err);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFound('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFound('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .orFail(new NotFound('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .orFail(new NotFound('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch(next);
};
