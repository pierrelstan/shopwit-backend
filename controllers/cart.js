const Item = require('../models/item');
// const User = require("../models/user");
const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

exports.addToCart = (req, res, next) => {
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
  Cart.findOne(
    {
      item: ItemId,
      userId: req.user.userId,
    },
    function (err, alreadyExistCart) {
      if (err) console.log(err);
      if (alreadyExistCart) {
        console.log('This has already been saved');
        return res.status(401).json({
          errors: [{msg: 'This has already been saved'}],
        });
      } else {
        item
          .then((item) => {
            const cart = new Cart({
              quantity: 1,
              item: item._id,
              userId: req.user.userId,
              update: false,
            });
            cart
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

exports.findCartByUserId = (req, res, next) => {
  let id = req.user.userId;
  let cart = Cart.find({userId: id});

  cart.populate({
    path: 'item',
    model: 'Item',
  });
  cart
    .then((cart) => {
      res.status(201).json(cart);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.updateCart = (req, res, next) => {
  const carts = new Cart({
    _id: req.params.id,
    quantity: req.body.quantity,
    update: req.body.update,
    userId: req.user,
  });

  Cart.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    carts,
    (error, cart) => {
      if (error) console.log(error);
      res.status(201).json({
        message: 'Cart Updated Successfully',
      });
    },
  );
};

exports.removeCartById = (req, res, next) => {
  // console.log(req);
  const productId = req.params.id;
  let cart = Cart.findOneAndDelete({
    _id: productId,
  });
  cart
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
