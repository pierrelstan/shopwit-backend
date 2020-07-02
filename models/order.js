const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  carts: {},
  subTotal: {type: String, require: true},
});

module.exports = mongoose.model('Order', orderSchema);
