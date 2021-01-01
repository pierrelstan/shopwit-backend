const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var compression = require('compression');
var helmet = require('helmet');
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const ratingRoutes = require('./routes/rating');
const favoritesRoutes = require('./routes/favorites');

const app = express();
app.use(helmet());
app.use(compression()); //Compress all routes

mongoose
  .connect(
    'mongodb+srv://stanley:yStLbYWxpZR3bQGl@cluster0-pwial.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
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
    origin: '*',
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use((req, res, next) => {
  res.header('Allow-Control-Allow-Origin: *');
  res.header('Access-Control-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-type,Authorization,Cache-Control',
  );

  next();
});

app.use('/item', itemRoutes);
app.use('/order', orderRoutes);
app.use('/auth', userRoutes);
app.use('/rating', ratingRoutes);
app.use('/item', favoritesRoutes);
module.exports = app;
