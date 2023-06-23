const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0/mestodb', {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '649320991d1c68c27bc4f013',
  };

  next();
});

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
