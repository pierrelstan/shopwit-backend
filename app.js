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

const whitelist = ['http://localhost:3000', 'https://pierrelstan.github.io'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.options('*', cors());
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
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
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
