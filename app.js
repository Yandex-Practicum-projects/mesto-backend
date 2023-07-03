const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { validateLogin, validateCreateUser } = require('./validations/user');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://0.0.0.0/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/', require('./routes'));

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
  } else {
    // const { statusCode = 500, message } = err;
    // res.status(statusCode).send({
    //   message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message,
    // });
    res.send({ message: err.message, name: err.name });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Порт: ${PORT}`);
});
