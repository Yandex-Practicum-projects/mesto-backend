const Card = require('../models/card');

const handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданны некорректныне данные' });
    return;
  }
  if (err.message === 'NotValidId') {
    res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
    return;
  }
  res.status(500).send({ message: err.message });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
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
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => handleError(err, res));
};
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => handleError(err, res));
};
