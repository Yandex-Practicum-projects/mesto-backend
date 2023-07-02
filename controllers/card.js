const Card = require('../models/card');
const NotFound = require('../errors/not-found');
const NoAccess = require('../errors/no-access');

const handleError = (err, next) => {
  if (err.name === 'CastError') {
    return next(new NotFound('Запрашиваемая карточка не найдена'));
  }
  return next(err);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFound('Запрашиваемая карточка не найдена'))
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        Card.deleteOne(card)
          .then(() => res.send({ message: 'Карточка удалена' }));
      } else {
        throw new NoAccess('Нелья удалять карточки других пользователей');
      }
    })
    .catch((err) => handleError(err, next));
};
module.exports.createCard = (req, res, next) => {
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
    .catch(next);
};
module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('Запрашиваемая карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, next));
};
module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('Запрашиваемая карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, next));
};
