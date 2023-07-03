const router = require('express').Router();
const { validateUpdateUserInfo, validateUpdateAvatar, validateUserId } = require('../validations/user');
const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
