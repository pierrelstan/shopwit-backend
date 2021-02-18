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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
// Add headers
app.use(function (req, res, next) {
  req.header('x-request-id');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Content-Type : application/json');
  req.header('Referer');
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE,PATCH,OPTIONS',
    );

    return res.status(200).json({});
  }
  next();
});
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

app.use('/api/item', itemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/item', favoritesRoutes);
app.use('/api', cartsRoutes);

module.exports = app;
