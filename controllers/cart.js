const Item = require('../models/item');
// const User = require("../models/user");
const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.addToCart = (req, res, next) => {
  const errors = validationResult(req);
  let userId = req.body.userId;

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
      userId: userId,
    },
    function (err, alreadyExistCart) {
      if (err) console.log(err);
      if (alreadyExistCart) {
        return res.status(401).json({
          errors: [{ msg: 'This has already been saved' }],
        });
      } else {
        item
          .then((item) => {
            const cart = new Cart({
              quantity: 1,
              item: item._id,
              userId: userId,
              update: false,
              isAddedToCart: true,
            });
            cart
              .populate({
                path: 'item',
                model: 'Item',
              })
              .save()
              .then((carts) => {
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
  let id = req.params.id;
  let cart = Cart.find({ userId: id });

  cart.populate({
    path: 'item',
    model: 'Item',
  });
  cart
    .then((cart) => {
      let ar = [];
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

exports.updateCart = async (req, res, next) => {
  let id = req.body.userId;
  let cartUserId = await Cart.findOne({ _id: req.params.id });
  const { userId } = cartUserId;
  if (userId === id) {
    try {
      const carts = await new Cart({
        _id: req.params.id,
        quantity: req.body.number.quantity,
        update: req.body.update,
        userId: userId,
      });

      await Cart.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        carts,
        (error) => {
          if (error) console.log(error);
          res.status(201).json({
            message: 'Cart Updated Successfully',
          });
        },
      );
    } catch (error) {
      await res.status(404).json({
        error: error,
      });
    }
  } else {
    res.status(400).json({
      error: 'Item not belongs to you , access denied!',
    });
  }
};

exports.removeCartById = async (req, res, next) => {
  let id = req.body.userId;
  let cartUserId = await Cart.findOne({ _id: req.params.id });
  const { userId } = cartUserId;
  try {
    if (userId === id) {
      const productId = req.params.id;

      try {
        await Cart.findOneAndDelete({
          _id: productId,
        });
        await res.status(201).json({
          message: 'Delete successfuly !',
        });
      } catch (error) {
        await res.status(404).json({
          error: error,
        });
      }
    } else {
      res.status(400).json({
        error: 'Item not belongs to you , access denied!',
      });
    }
  } catch (error) {
    await res.status(404).json({
      error: error,
    });
  }
};
