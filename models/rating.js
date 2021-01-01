const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
  rating: { type: Number, required: true },
  avgRating: { type: Number },
});

module.exports = mongoose.model('Rating', ratingSchema);
