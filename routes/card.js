const router = require('express').Router();
const { validateCreateCard, validateCardId } = require('../validations/card');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.delete('/:cardId/likes', validateCardId, removeLike);
router.put('/:cardId/likes', validateCardId, addLike);

module.exports = router;
