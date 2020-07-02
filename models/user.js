const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
  firstname: {type: String, trim: true, require: true},
  lastname: {type: String, trim: true, require: true},
  email: {
    type: String,
    lowercase: true,
    trim: true,
    require: true,
    unique: true,
  },
  password: {type: String, require: true},
  avatar: {type: String},
  created: {type: Date, default: Date.now},
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);
