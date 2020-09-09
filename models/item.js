const mongoose = require('mongoose');

const itemShema = mongoose.Schema({
  title: {type: String, require: true},
  description: {type: String, require: true},
  imageUrl: {type: String, require: true},
  price: {type: Number, require: true},
  quantityProducts: {type: Number, require: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
  created: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Item', itemShema);
