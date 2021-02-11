const Item = require('../models/item');
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

exports.removeFavoritesById = async (req, res, next) => {
  let favoriteById = await Favorites.findOne({ _id: req.params.id });

  const { userId } = favoriteById;
  try {
    if (userId === req.user.userId) {
      try {
        const productId = req.params.id;
        await Favorites.findOneAndDelete({
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
      await res.status(400).json({
        error: 'Item not belongs to you , access denied!',
      });
    }
  } catch (error) {
    await res.status(400).json({
      error: error,
    });
  }
};
