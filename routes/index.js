const express = require('express');
const { HTTP_STATUS_CODES } = require('http2');

const app = express();

app.use(express.json());
app.use('/cards', require('./card'));
app.use('/users', require('./user'));

app.use((req, res) => {
  res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: 'Неверный маршрут' });
});

module.exports = app;
