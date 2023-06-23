const mongoose = require('mongoose');
const { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../errors/errors');
const Card = require('../models/card');

const handleError = (err, res) => {
  if (err.message === 'NotValidId') {
    res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    res.status(BAD_REQUEST).send({ message: 'Переданны некорректныне данные' });
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => handleError(err, res));
};
module.exports.createCard = (req, res) => {
  const {
    name,
    link,
    likes,
    createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name,
    link,
    owner,
    likes,
    createdAt,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleError(err, res));
};
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};
