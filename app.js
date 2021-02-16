const express = require('express');
var path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var compression = require('compression');
var helmet = require('helmet');
require('dotenv').config();
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const ratingRoutes = require('./routes/rating');
const favoritesRoutes = require('./routes/favorites');
const cartsRoutes = require('./routes/carts');

const app = express();
app.use(helmet());
app.use(compression()); //Compress all routes

mongoose
  .connect(process.env.MONGODB_API_KEY, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MONGODB ATLAS!');
  })
  .catch((error) => {
    console.log('Unable to connect to MONGODB ATLAS!');
    console.error(error);
  });

// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://pierrelstan.github.io/shopwitapp',
//   }),
// );
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
  res.header(
    'Allow-Control-Allow-Origin: http://pierrelstan.github.io/shopwitapp/',
  );
  res.header('Access-Control-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-type,Authorization,Cache-Control',
  );

  next();
});
app.use('/api/item', itemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/item', favoritesRoutes);
app.use('/api', cartsRoutes);

module.exports = app;
