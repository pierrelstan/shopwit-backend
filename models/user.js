const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
  firstname: { type: String, trim: true, require: true },
  lastname: { type: String, trim: true, require: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    require: true,
    unique: true,
  },
  password: { type: String, require: true },
  avatar: { type: String },
  active: { type: Boolean, default: true },
  cloudinary_id: {type: String},
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  permission: [
    {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'permissionType',
        required: true,
      },
      read: { type: Boolean, default: false, required: true },
      write: { type: Boolean, default: false, required: true },
      delete: { type: Boolean, default: false, required: true },
    },
  ],
  resetToken: { type: String },
  resetTokenExpiration: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);
