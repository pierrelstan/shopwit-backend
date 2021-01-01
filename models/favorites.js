const mongoose = require('mongoose');

const favoritesShema = mongoose.Schema({
  userId: { type: String, require: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  quantity: { type: Number, require: true },
  update: { type: Boolean, require: true },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  isAddedToCart: { type: Boolean, require: true },
});

module.exports = mongoose.model('Favorites', favoritesShema);
