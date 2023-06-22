const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
