const express = require('express');
const router = express.Router();
// const OrderCtrl = require("../controllers/order.js");
const CartCtrl = require('../controllers/cart.js');
const auth = require('../middleware/auth');
// create an order
// router.post("/new/order", OrderCtrl.postOrder);
// add to cart
router.post('/add-to-cart/:id', auth, CartCtrl.addToCart);

router.get('/cart/:id', auth, CartCtrl.findCartByUserId);

router.post('/removeCart/:id', auth, CartCtrl.removeCartById);
router.put('/updateCart/:id', auth, CartCtrl.updateCart);
module.exports = router;
