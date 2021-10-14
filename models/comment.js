const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = Schema({
  text: { type: String, require: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
