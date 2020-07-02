const express = require('express');
const router = express.Router();
// const Item = require("../models/item");

const ItemCtrl = require('../controllers/item.js');
// const OrderCtrl = require("../controllers/order.js");
const CartCtrl = require('../controllers/cart.js');
const auth = require('../middleware/auth');

// retrieving all
router.use('/all', ItemCtrl.getAllItem);
// create a new item
router.post('/new', auth, ItemCtrl.createItem);
// retrieving one item
router.get('/:id', auth, ItemCtrl.getOneItem);
// edit item
router.put('/:id', auth, ItemCtrl.modifyItem);
// delete an item
router.delete('/:id', auth, ItemCtrl.deleteItem);
router.get('/user/items/:id', auth, ItemCtrl.getAllItemsByUser);

// create an order
// router.post("/new/order", OrderCtrl.postOrder);
// add to cart
router.post('/add-to-cart/:id', auth, CartCtrl.addToCart);

router.get('/cart/:id', auth, CartCtrl.findCartByUserId);

router.post('/removeCart/:id', CartCtrl.removeCartById);
router.put('/updateCart/:id', CartCtrl.updateCart);
module.exports = router;
