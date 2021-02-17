const express = require('express');
const router = express.Router();
const ItemCtrl = require('../controllers/item.js');
// const OrderCtrl = require("../controllers/order.js");
const cors = require('cors');
const auth = require('../middleware/auth');
// retrieving all
router.use('/all', ItemCtrl.getAllItem);
// retrieving heigth last item
router.get('/lastproducts', ItemCtrl.getHeigthlastItems);
// create a new item
router.post('/new', auth, ItemCtrl.createItem);
// retrieving one item
router.get('/:id', ItemCtrl.getOneItem);
// edit item
router.put('/:id', auth, ItemCtrl.modifyItem);
// delete an item
router.post('/item_id=:id', auth, ItemCtrl.deleteItem);
router.get('/user/items/:id', auth, ItemCtrl.getAllItemsByUser);
// search items
router.get('/s/search?', ItemCtrl.searchItems);

// pagination items
router.get('/page/:page', ItemCtrl.getPaginationItems);

module.exports = router;
