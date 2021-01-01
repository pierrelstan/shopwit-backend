const mongoose = require('mongoose');

const itemShema = mongoose.Schema({
  type: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String, require: true },
  imageUrl: { type: String, require: true },
  price: { type: Number, require: true },
  quantityProducts: { type: Number, require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  ratings: { type: mongoose.Schema.ObjectId, ref: 'Rating' },
  rating: { type: Number },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemShema);
