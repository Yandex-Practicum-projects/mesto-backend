const { HTTP_STATUS_CODES } = require('http2');
const mongoose = require('mongoose');
const User = require('../models/user');

const options = { new: true, runValidators: true };
const handleError = (err, res) => {
  if (err.message === 'NotValidId') {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Переданны некорректныне данные' });
    return;
  }
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_CODES.OK).send(users))
    .catch((err) => handleError(err, res));
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((err) => handleError(err, res));
};
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((err) => handleError(err, res));
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((err) => handleError(err, res));
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CODES.CREATED).send(user))
    .catch((err) => handleError(err, res));
};
