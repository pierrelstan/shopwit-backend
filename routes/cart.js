const express = require('express');
const router = express.Router();

const CartCtrl = require('../controllers/cart.js');
const auth = require('../middleware/auth');

router.post('/:id', auth, CartCtrl.addToCart);
router.get('/:id', auth, CartCtrl.findCartByUserId);
router.post('/:id', auth, CartCtrl.removeCartById);
router.put('/:id', auth, CartCtrl.updateCart);

module.exports = router;