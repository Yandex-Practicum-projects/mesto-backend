const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', removeLike);
router.put('/:cardId/likes', addLike);

module.exports = router;
