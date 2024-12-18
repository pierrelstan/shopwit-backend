const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var gravatar = require('gravatar');
const crypto = require('crypto');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const Item = require('../models/item');
const Cart = require('../models/cart');

const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const cloudinary = require('../middleware/cloudinary');

let transporter = nodemailer.createTransport(
  // sendGridTransport({
  //   auth: {
  //     api_key:
  //       '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',
  //   },
  // }),
  {
    type: 'OAuth2',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'stanleypl75@gmail.com', // generated ethereal user
      pass: '781227JesusIsMyLord', // generated ethereal password
    },
  },
);

exports.user = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId).select(
      '-password -confirmPassword -_id',
    );
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { firstname, lastname, password, confirmPassword, email } = req.body;
  try {
    // see if user exists
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        errors: [{ msg: 'User already exits' }],
      });
    }
    // Get users avatar
    const avatar = gravatar.url(email, {
      protocol: 'http',
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
    let jwtSecret = process.env.RANDOM_TOKEN_SECRET;
    jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, (err, token) => {
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
  if (errors.isEmpty()) {
    const { password, email } = req.body;
    try {
      // see if user exists
      let user = await User.findOne({
        email,
      });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'There was a problem logging in. Check your email and password or create an account.',
            },
          ],
        });
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        res.status(404).json({
          errors: [{ msg: 'Please enter the correct password' }],
        });
      }
      const payload = {
        user: {
          userId: user.id,
        },
      };
      let jwtSecret = process.env.RANDOM_TOKEN_SECRET;
      jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, (err, token) => {
        if (err) {
          res.status(404).json({
            errors: err,
          });
        }
        res.json({
          token,
        });
      });
    } catch (error) {
      res.status(500).json('Server Error');
    }
  } else {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(400).json({
        msg: err,
      });
    }
    const token = buffer.toString('hex');
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: { msg: 'No account with that email found.' },
        });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      user.save();
      let url = `http://localhost:3000/newpassword/${token}`;
      transporter.sendMail({
        to: email,
        from: 'shopwit@gmail.com',
        subject: 'Reset password',
        html: `Please click this link to create a new password ${url}`,
      });

      return res.json({
        email: 'Please verify your email',
      });
    } catch (err) {
      res.status(404).json({
        errors: err,
      });
    }
  });
};

exports.newPassword = async (req, res, next) => {
  const { email } = req;
  let token = req.params.id;
  try {
    let user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    const salt = await bcrypt.genSalt(10);

    let ha1 = await bcrypt.hash(req.body.password, salt);
    const NewUser = await new User({
      _id: user._id,
      password: ha1,
      resetToken: undefined,
      resetTokenExpiration: undefined,
    });

    const isMatched = await bcrypt.compare(req.body.password, NewUser.password);
    if (!isMatched) {
      return res.status(400).json({
        errors: [{ msg: 'Your enter your old password' }],
      });
    }
    try {
      let usser = await User.findOneAndUpdate(
        {
          _id: user._id,
        },
        NewUser,
        (err, user) => {
          if (err) console.log(err);
          const payload = {
            user: {
              userId: user._id,
            },
          };

          let jwtSecret = process.env.RANDOM_TOKEN_SECRET;
          jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            if (token) {
              transporter.sendMail({
                to: email,
                from: 'shopwit@gmail.com',
                subject: 'Password reset',
                html: `Password reset successfully!!`,
              });
              return res.json({
                token,
              });
            }
          });
        },
      );
      await NewUser.save();
      return await usser.save();
    } catch (err) {
      res.status(500).json('Server Error');
    }
  } catch (err) {
    res.status(500).json('Server Error');
  }
};
exports.getOneUser = (req, res, next) => {
  let user = User.findById({
    _id: req.user.userId,
  });
  user.exec(function (err, user) {
    if (err) {
    } else {
      res.status(200).json(user);
    }
  });
};

exports.updateOneUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    let obj = JSON.parse(JSON.stringify(req.body));

    let filePath = req.file && req.file.path;

    if (filePath) {
      if (user.cloudinary_id) {
        await cloudinary.uploader.destroy(user.cloudinary_id);
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          upload_preset: 'ecommerce',
        });

        const data = {
          firstname: obj.firstname || user.firstname,
          lastname: obj.lastname || user.lastname,
          location: obj.location || user.location,
          avatar: result.secure_url || user.avatar,
          cloudinary_id: result.public_id || user.cloudinary_id,
        };
        user = await User.findByIdAndUpdate(req.params.id, data, {
          new: true,
        });
        return res.status(201).json({
          message: 'User Updated successfully!',
        });
      }
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        upload_preset: 'ecommerce',
      });

      const data = {
        firstname: obj.firstname || user.firstname,
        lastname: obj.lastname || user.lastname,
        location: obj.location || user.location,
        avatar: result.secure_url || user.avatar,
        cloudinary_id: result.public_id || user.cloudinary_id,
      };
      user = await User.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      return res.status(201).json({
        message: 'User Updated successfully!',
      });
    }

    const data = {
      firstname: req.body.firstname || user.firstname,
      lastname: req.body.lastname || user.lastname,
      location: req.body.location || user.location,
      avatar: user.avatar,
      cloudinary_id: user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    return res.status(201).json({
      message: 'User Updated successfully!',
    });
  } catch (err) {
    console.log(err);
  }
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
  const { id } = req.body;
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
