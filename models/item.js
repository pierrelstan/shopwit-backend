const  mongoose =require('mongoose');
const { Schema } = mongoose;

const itemSchema = Schema({
  // genre: { type: String, require: true },
  title: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  price: { type: Number },
  quantityProducts: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  ratings: { type: mongoose.Schema.ObjectId, ref: 'Rating' },
  rating: { type: Number },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);