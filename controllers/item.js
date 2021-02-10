const Item = require('../models/item');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Order = require('../models/order');
// const Cart = require("../models/cart");1
const User = require('../models/user');
const TakeMyMoney = require('../utils/TakeMyMoney');
let ITEM_PER_PAGE = 9;

exports.createItem = (req, res, next) => {
  const { genre, imageUrl, title, quantityProducts, description } = req.body;
  let money = TakeMyMoney(req.body.price);

  const item = new Item({
    genre: genre,
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: money,
    quantityProducts: quantityProducts,
    userId: req.user.userId,
  });
  // save the data to mongodb
  item
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Create Item successfully!',
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

exports.getHeigthlastItems = (req, res, next) => {
  Item.find()
    .sort('-created')
    .limit(8)
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

exports.modifyItem = async (req, res, next) => {
  let money = TakeMyMoney(req.body.price);

  if (req.user.userId !== req.body.userId) {
    res.status(401).json({
      error: 'Item not belongs to you , access denied!',
    });
  } else {
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
  }
};

exports.deleteItem = async (req, res, next) => {
  let itemById = await Item.findOne({ _id: req.params.id });

  const { userId } = itemById;
  if (userId === req.user.userId) {
    Item.findOneAndDelete({
      _id: req.params.id,
    })
      .then(() => {
        res.status(200).json({
          message: 'Delete item successfully!',
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  } else {
    res.status(400).json({
      error: 'Item not belongs to you , access denied!',
    });
  }
};

exports.getAllItemsByUser = (req, res, next) => {
  Item.find({ userId: req.user.userId })
    .sort('-created')
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((err) => {
      res.status(400).json({
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
