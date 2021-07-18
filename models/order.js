const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carts: { type: [mongoose.Schema.Types.ObjectId], ref: 'Cart' },
  subTotal: { type: String, require: true },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
