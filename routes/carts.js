const express = require('express');
const router = express.Router();
const OrderCtrl = require('../controllers/order.js');
const CartCtrl = require('../controllers/cart.js');
const auth = require('../middleware/auth');

router.post('/:id', auth, CartCtrl.addToCart);
router.get('/:id', auth, CartCtrl.findCartByUserId);
router.delete('/remove/:id', auth, CartCtrl.removeCartById);
router.put('/:id', auth, CartCtrl.updateCart);
router.post('/remove/carts', auth, CartCtrl.removeCartsIdsAfterTheOrdering);

module.exports = router;
