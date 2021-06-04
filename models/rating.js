const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
    item: { type: mongoose.Schema.ObjectId, ref: 'Item', require: true },
    rating: { type: Number },
    avgRating: { type: Number },
});

module.exports = mongoose.model('Rating', ratingSchema);
