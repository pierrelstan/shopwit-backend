const express = require('express');
const router = express.Router();

const ItemCtrl = require('../controllers/item.js');
// const OrderCtrl = require("../controllers/order.js");
const CartCtrl = require('../controllers/cart.js');

const auth = require('../middleware/auth');
const { check, validationResult, body } = require('express-validator');

// retrieving all
router.use("/",ItemCtrl.getAllItem);
// retrieving heigth last item
router.get('/lastproducts', ItemCtrl.getHeigthlastItems);
// create a new item
router.post('/new', ItemCtrl.CreateItem);
// retrieving one item
router.get('/:id', ItemCtrl.getOneItem);
// edit item
router.put('/:id', auth, ItemCtrl.modifyItem);
// delete an item
router.delete('/:id', auth, ItemCtrl.deleteItem);
router.get('/items/:id', auth, ItemCtrl.getAllItemsByUser);
// search items
router.get('/s/search?', ItemCtrl.searchItems);

// pagination items
router.get('/page/:page', ItemCtrl.getPaginationItems);

// create an order
// router.post("/new/order", OrderCtrl.postOrder);
// add to cart
// router.post('/add-to-cart/:id', auth, CartCtrl.addToCart);

// router.get('/cart/:id', auth, CartCtrl.findCartByUserId);

// router.post('/removeCart/:id', auth, CartCtrl.removeCartById);
// router.put('/updateCart/:id', auth, CartCtrl.updateCart);

module.exports = router;
