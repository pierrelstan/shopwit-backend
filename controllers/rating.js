const Rating = require('../models/rating');
const user = require('../models/user');

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
            let rating = await Rating.updateOne(
                {
                    item: req.params.id,
                },
                data
            );
            console.log(rating);
            res.status(201).json({
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

exports.findRatingsByUserId = (req, res, next) => {
    let ratings = Rating.findOne({ item: req.params.id });

    ratings.exec(function (err, rating) {
        if (err)
            res.status(404).json({
                error: error,
            });
        res.status(201).json(rating);
    });
};
