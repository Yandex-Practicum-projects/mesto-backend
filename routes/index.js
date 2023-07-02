const router = require('express').Router();
const NotFound = require('../errors/not-found');

router.use('/cards', require('./card'));
router.use('/users', require('./user'));

router.use('*', () => {
  throw new NotFound('Неверный маршрут');
});

module.exports = router;
