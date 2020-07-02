const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var gravatar = require('gravatar');
const User = require('../models/user');
const Item = require('../models/item');
const Cart = require('../models/cart');
// const Order = require(".../models/order");
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');

exports.user = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      '-password -confirmPassword',
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.signup = async (req, res, next) => {
  console.log(req);
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {firstname, lastname, password, confirmPassword, email} = req.body;
  try {
    // see if user exists
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        errors: [{msg: 'User already exits'}],
      });
    }
    // Get users avatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });
    user = new User({
      firstname,
      lastname,
      avatar,
      email,
      password,
      confirmPassword,
    });
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.confirmPassword = await bcrypt.hash(confirmPassword, salt);
    await user.save();

    // Return jsonwebtoken

    const payload = {
      user: {
        userId: user.id,
      },
    };
    let jwtSecret = 'RANDOM_TOKEN_SECRET';
    jwt.sign(payload, jwtSecret, {expiresIn: 36000}, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
      });
    });
  } catch (error) {
    console.error(err.message);
    return res.status(500).json('Server Error');
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  console.log('login');
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {password, email} = req.body;
  try {
    // see if user exists
    let user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        errors: [{msg: 'Invalid credentials'}],
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      res.status(404).json({
        errors: [{msg: 'Invalid credentials'}],
      });
    }
    const payload = {
      user: {
        userId: user.id,
      },
    };
    let jwtSecret = 'RANDOM_TOKEN_SECRET';
    jwt.sign(payload, jwtSecret, {expiresIn: 36000}, (err, token) => {
      if (err) throw err;
      console.log(token);
      res.json({
        token,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Server Error');
  }
};

exports.forgotPassword = async (req, res, next) => {
  const {firstname, lastname, password, email, avatar} = req.body;
  try {
    let user = await User.findOne(req.body.email).select('-password');
    if (!user) {
      return res.status(400).json({
        errors: [{msg: 'Invalid email'}],
      });
    }
    const payload = {
      user: {
        userId: user.id,
      },
    };
    let jwtSecret = 'RANDOM_TOKEN_SECRET';
    jwt.sign(payload, jwtSecret, {expiresIn: 36000}, (err, token) => {
      if (err) throw err;

      let testAccount = nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        type: 'OAuth2',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'stanleypl75@gmail.com', // generated ethereal user
          pass: 'PPhUOko781227', // generated ethereal password
        },
      });

      let url = `http://localhost:3000/newpassword/${token}`;
      // send mail with defined transport object
      let info = transporter.sendMail({
        from: 'stanleypl75@gmail.com', // sender address
        to: 'stanleypl75@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `Please click this link to confirm your email ${url}`, // html body
      });

      res.json({
        email: 'Please verify your email',
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.newPassword = async (req, res, next) => {
  try {
    // 1 decode the token
    let decode = jwt.decode(req.params.id);

    const salt = await bcrypt.genSalt(10);

    let ha1 = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      _id: decode.user.userId,
      password: ha1,
    });

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    // 6 if the
    if (!isMatched) {
      console.log('Your enter your old password ');
      return res.status(400).json({
        errors: [{msg: 'Your enter your old password'}],
      });
    }

    let usser = await User.findOneAndUpdate(
      {
        _id: decode.user.userId,
      },
      user,
      (err, user) => {
        if (err) console.log(err);
        console.log(user);
        const payload = {
          user: {
            userId: user._id,
          },
        };

        let jwtSecret = 'RANDOM_TOKEN_SECRET';
        jwt.sign(payload, jwtSecret, {expiresIn: 36000}, (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        });
      },
    );

    await user.save();
    await usser.save();
  } catch (err) {
    res.status(500).json('Server Error');
  }
};
exports.getOneUser = (req, res, next) => {
  console.log(res);
  let user = User.findById({
    _id: req.user.userId,
  });
  user.exec(function (err, user) {
    if (err) {
      console.log(err);
    } else {
      // console.log(req);
      res.status(200).json(user);
    }
  });
};

exports.updateOneUser = (req, res, next) => {
  const user = new User({
    _id: req.params.id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    avatar: req.body.avatar,
    userId: req.body.userId,
    email: req.body.email,
  });
  User.updateOne(
    {
      _id: req.params.id,
    },
    user,
  )
    .then((user) => {
      res.status(201).json({
        user: user,
        message: 'User Updated successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllUser = (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(200).json({
        users: user,
      });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllUserItemPopulate = (req, res, next) => {
  const {id} = req.body;
  Item.findById(id)

    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
