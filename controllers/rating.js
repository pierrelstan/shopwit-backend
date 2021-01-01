const Rating = require('../models/rating');

exports.createRatingItem = (req, res, next) => {
  console.log(req);
  let rating = new Rating({
    rating: req.body.rating,
    userId: req.user.userId,
  });
  rating
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
