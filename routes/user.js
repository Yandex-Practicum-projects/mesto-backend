const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUserInfo,
} = require('../controllers/user');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', getUserById);

module.exports = router;
