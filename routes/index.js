const router = require('express').Router();
const { NOT_FOUND } = require('../errors/errors');

router.use('/cards', require('./card'));
router.use('/users', require('./user'));

router.use('*', (req, res) => {
  res.status(NOT_FOUND).json({ message: 'Неверный маршрут' });
});

module.exports = router;
