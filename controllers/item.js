const Item = require('../models/item');
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const User = require('../models/user');
const TakeMyMoney = require('../utils/TakeMyMoney');

exports.createItem = (req, res, next) => {
  const {
    genre,
    imageUrl,
    title,
    quantityProducts,
    description,
    price,
  } = req.body;

  let money = TakeMyMoney(price);

  const item = new Item({
    genre: genre,
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: money,
    quantityProducts: quantityProducts,
    creator: req.user.userId,
  });
  // save the data to mongodb
  item
    .populate({
      path: 'creator',
      model: 'User',
    })
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
  let ITEM_PER_PAGE = 8;
  let page = parseInt(req.params.page);
  let skip = (page - 1) * ITEM_PER_PAGE;
  Item.find()
    .skip(skip)
    .limit(ITEM_PER_PAGE)
    .sort('-created')
    .then((items) => {
      return res.status(200).json(items);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifyItem = async (req, res, next) => {
  let money = TakeMyMoney(req.body.price);
  let id = req.params.id;
  let itemCreator = await Item.findById({ _id: id });

  const { creator } = itemCreator;
  if (creator.equals(req.user.userId)) {
    const item = new Item({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      price: money,
      imageUrl: req.body.imageUrl,
      quantityProducts: req.body.quantityProducts,
      creator: creator,
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
  } else {
    res.status(400).json({
      error: 'Item not belongs to you , access denied!',
    });
  }
};

exports.deleteItem = async (req, res, next) => {
  let token = req.headers['x-auth-token'];
  let itemById = await Item.findById({ _id: req.params.id });

  let { creator } = itemById;
  if (creator.equals(req.user.userId)) {
    try {
      await Item.findOneAndDelete({
        _id: req.params.id,
      });
    } catch (error) {
      res.status(400).json({
        error: error,
      });
    }
  } else {
    res.status(400).json({
      error: 'Item not belongs to you , access denied!',
    });
  }
};

exports.getAllItemsByUser = (req, res, next) => {
  Item.find({ creator: req.user.userId })
    .sort('-created')
    .then((item) => {
      res.status(200).json(item);
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
