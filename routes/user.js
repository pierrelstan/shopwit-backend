const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const { check, body } = require('express-validator');
router.get('/me/:id', auth, UserCtrl.user);
router.post(
  '/signup',
  [
    check('firstname', 'First Name is required').not().isEmpty(),
    check('lastname', 'Last Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail().exists(),
    check(
      'password',
      'Please enter a password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],
  UserCtrl.signup,
);
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  UserCtrl.login,
);
router.get('/users', UserCtrl.getAllUser);
router.post(
  '/resetpassword',
  [check('email', 'Please include a valid email').isEmail()],
  UserCtrl.forgotPassword,
);
router.post(
  '/newpassword/:id',
  check(
    'password',
    'Please enter a password with 6 or more characters',
  ).isLength({ min: 6 }),
  check(
    'password2',
    'Please enter a password with 6 or more characters',
  ).isLength({ min: 6 }),
  body('passwordConfirmation').custom((value, { req }) => {
    if (req.body.password2 !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  UserCtrl.newPassword,
);
router.get('/user/:id', auth, UserCtrl.getOneUser);
router.put('/user/:id/edit', auth, UserCtrl.updateOneUser);
router.get('/user/populate/:id', auth, UserCtrl.getAllUserItemPopulate);
// router.get("/user/items/:id", UserCtrl.getOneUserItems);

module.exports = router;
