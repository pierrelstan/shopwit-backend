const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  carts: { type: [Schema.Types.ObjectId], ref: 'Item' },
  subTotal: { type: Number, require: true },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
