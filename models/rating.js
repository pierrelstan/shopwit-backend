const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
    item: { type: mongoose.Schema.ObjectId, ref: 'Item', require: true },
    rating: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Rating', ratingSchema);
