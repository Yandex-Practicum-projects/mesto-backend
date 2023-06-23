const { HTTP_STATUS_CODES } = require('http2');
const mongoose = require('mongoose');
const Card = require('../models/card');

const handleError = (err, res) => {
  console.log(err.name);
  if (err.message === 'NotValidId') {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Переданны некорректныне данные' });
    return;
  }
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(() => res.status(HTTP_STATUS_CODES.OK).send({ message: 'Карточка удалена' }))
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
    .then((card) => res.status(HTTP_STATUS_CODES.CREATED).send(card))
    .catch((err) => handleError(err, res));
};
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(HTTP_STATUS_CODES.OK).send(card))
    .catch((err) => handleError(err, res));
};
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(HTTP_STATUS_CODES.OK).send(card))
    .catch((err) => handleError(err, res));
};
