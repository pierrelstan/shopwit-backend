const Item = require('../models/item');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Order = require('../models/order');
// const Cart = require("../models/cart");
const User = require('../models/user');
const TakeMyMoney = require('../ultils/TakeMyMoney');
let ITEM_PER_PAGE = 9;

exports.createItem = (req, res, next) => {
  let money = TakeMyMoney(req.body.price);
  const item = new Item({
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: money,
    quantityProducts: req.body.quantityProducts,
    userId: req.user.userId,
  });
  // save the data to mongodb
  item
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Post saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneItem = (req, res, next) => {
  Item.findOne({
    _id: req.params.id,
  })

    .then((item) => {
      res.status(200).json(item);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllItem = (req, res, next) => {
  Item.find()
    .sort('-created')
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getPaginationItems = (req, res, next) => {
  let page = parseInt(req.params.page);
  let skip = (page - 1) * ITEM_PER_PAGE;
  Item.find()
    .skip(skip)
    .limit(ITEM_PER_PAGE)
    .sort('-created')
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifyItem = (req, res, next) => {
  let money = TakeMyMoney(req.body.price);
  const item = new Item({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    price: money,
    imageUrl: req.body.imageUrl,
    quantityProducts: req.body.quantityProducts,
    userId: req.user.userId,
  });
  Item.updateOne(
    {
      _id: req.params.id,
    },
    item,
  )
    .then(() => {
      res.status(201).json({
        message: 'Item Updated successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteItem = (req, res, next) => {
  Item.deleteOne({
    _id: req.params.id,
  })
    .then(() => {
      res.status(200).json({
        message: 'Item deleted!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllItemsByUser = (req, res, next) => {
  Item.find({ userId: req.params.id })
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((err) => {
      res.status(401).json({
        err: err,
      });
    });
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

exports.searchItems = (req, res, next) => {
  const regex = new RegExp(escapeRegex(req.query.title), 'gi');
  Item.find(
    {
      title: regex,
    },
    function (err, items) {
      if (err) res.status(401).json(err);
      else {
        res.status(201).json(items);
      }
    },
  );
};
