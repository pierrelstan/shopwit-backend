const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

const app = express();
mongoose
  .connect(
    'mongodb+srv://stanley:yStLbYWxpZR3bQGl@cluster0-pwial.mongodb.net/test?retryWrites=true&w=majority',
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
  )
  .then(() => {
    console.log('Successfully connected to MONGODB ATLAS!');
  })
  .catch((error) => {
    console.log('Unable to connect to MONGODB ATLAS!');
    console.error(error);
  });

app.use(
  cors({
    credentials: true,
  }),
);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}),
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

app.use('/item', itemRoutes);
app.use('/order', orderRoutes);
app.use('/auth', userRoutes);
module.exports = app;
