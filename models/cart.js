const mongoose = require("mongoose");

const cartShema = mongoose.Schema({
  userId: { type: String, require: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  quantity: { type: Number, require: true },
  update: { type: Boolean, require: true },
});

module.exports = mongoose.model("Cart", cartShema);
