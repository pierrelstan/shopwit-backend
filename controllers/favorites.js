const Item = require('../models/item');
// const User = require("../models/user");
const Favorites = require('../models/favorites');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.addToFavorites = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  let ItemId = req.params.id;
  let item = Item.findOne({
    _id: ItemId,
  });
  // find if cart already exist for the user
  Favorites.findOne(
    {
      item: ItemId,
      userId: req.user.userId,
    },
    function (err, alreadyExistCart) {
      if (err) console.log(err);
      if (alreadyExistCart) {
        console.log('This has already been saved');
        return res.status(401).json({
          errors: [{ msg: 'This has already been saved' }],
        });
      } else {
        item
          .then((item) => {
            const favorite = new Favorites({
              quantity: 1,
              item: item._id,
              userId: req.user.userId,
              update: false,
              isAddedToCart: true,
            });
            favorite
              .populate({
                path: 'item',
                model: 'Item',
              })
              .save()
              .then((carts) => {
                // console.log(carts);
                res.status(201).json(carts);
              })
              .catch((error) => {
                res.status(401).json({
                  error: error,
                });
              });
          })
          .catch((error) => {
            res.status(401).json({
              error: error,
            });
          });
      }
    },
  );
};

exports.findFavoritesByUserId = (req, res, next) => {
  let id = req.user.userId;
  let favorite = Favorites.find({ userId: id });

  favorite.populate({
    path: 'item',
    model: 'Item',
  });
  favorite
    .then((cart) => {
      let ar = [];
      console.log(cart);
      cart.filter((el) => {
        if (el.item !== null) ar.push(el);
      });
      res.status(201).json(ar);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.removeFavoritesById = (req, res, next) => {
  console.log(res);
  const productId = req.params.id;
  let favorite = Favorites.findOneAndDelete({
    _id: productId,
  });
  favorite
    .then((d) => {
      res.status(201).json({
        message: 'Delete successfuly !',
      });
    })
    .catch(() => {
      res.status(404).json({
        error: error,
      });
    });
};
