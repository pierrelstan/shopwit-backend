const Rating = require('../models/rating');
const user = require('../models/user');
const { ObjectId } = require('bson');

exports.createRatingItem = async (req, res, next) => {
  // see if user exists
  try {
    let singleRating = await Rating.findOne({
      item: req.params.id,
      userId: req.user.userId,
    });
    let data = {
      rating: req.body.rating,
    };
    if (singleRating) {
      await Rating.updateOne(
        {
          item: req.params.id,
          userId: req.user.userId,
        },
        data,
      );
      return res.status(201).json({
        message: 'Rate Updated successfully!',
      });
    } else {
      try {
        let rating = await new Rating({
          rating: req.body.rating,
          userId: req.user.userId,
          item: req.params.id,
        });
        rating
          .save()
          .then(() => {
            res.status(201).json({
              message: 'Rate successfully!',
            });
          })
          .catch((error) => {
            res.status(400).json({
              error: error,
            });
          });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.findRatingsByUserId = async (req, res, next) => {
  try {
    let ratings = await Rating.findOne({
      item: req.params.id,
      userId: req.user.userId,
    }).select('rating');
    res.status(201).json(ratings);
  } catch (error) {
    if (error) {
      res.status(201).json({
        rating: 0,
      });
    }
    res.status(404).json({
      error: error,
    });
  }
};

exports.queryAllRatingsAverage = async (req, res, next) => {
  let pipeline = [
    {
      $group: {
        _id: '$item',
        avgRating: {
          $max: { $avg: '$rating' },
        },
        count: {
          $sum: 1,
        },
        itemId: {
          $push: '$item',
        },
      },
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: '_id',
        as: 'item',
      },
    },
  ];
  try {
    let ratings = await Rating.aggregate(pipeline);
    res.status(201).json(ratings);
  } catch (error) {}
};
