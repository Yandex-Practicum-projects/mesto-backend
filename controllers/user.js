const mongoose = require('mongoose');
const { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../errors/errors');
const User = require('../models/user');

const options = { new: true, runValidators: true };
const handleError = (err, res) => {
  if (err.message === 'NotValidId') {
    res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    res.status(BAD_REQUEST).send({ message: 'Переданны некорректныне данные' });
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => handleError(err, res));
};
