
const express = require('express');
var path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var compression = require('compression');
var helmet = require('helmet');
require('dotenv').config();
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const ratingRoutes = require('./routes/rating');
const favoritesRoutes = require('./routes/favorites');
const cartRoutes = require('./routes/cart');

const app = express();
app.use(helmet());
app.use(compression()); //Compress all routes

app.use(
  cors({
    credentials: true,
    origin: '*',
  }),
);

mongoose
  .connect(process.env.MONGODB_API_KEY, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}
  )
  .then(() => {
    console.log('Successfully connected to MONGODB ATLAS!');
  })
  .catch((error) => {
    console.log('Unable to connect to MONGODB ATLAS!');
    console.error(error);
  });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
    parameterLimit: 50000,
  }),
);
app.use((req, res, next) => {
  res.header('Allow-Control-Allow-Origin: *');
  res.header('Access-Control-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,Cache-Control',
  );

  next();
});
app.use('/api/items', itemRoutes);
app.use("/api/carts",cartRoutes)
app.use('/api/orders', orderRoutes);
app.use('api/auth', userRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/favorites', favoritesRoutes);

module.exports = app;
