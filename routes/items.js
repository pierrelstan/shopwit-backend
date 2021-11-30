const express = require('express');
const router = express.Router();
const ItemCtrl = require('../controllers/item.js');
const auth = require('../middleware/auth');
const fileUpload = require('../middleware/file-uploads');
// retrieving all
router.get('/', ItemCtrl.getAllItem);
// retrieving heigth last item
router.get('/lastproducts', ItemCtrl.getHeigthlastItems);
// count  differents types items
router.get('/counts', ItemCtrl.queryCountTypes);
// create a new item
router.post('/new', fileUpload.single('image'), auth, ItemCtrl.createProduct);
// retrieving one item
router.get('/item/:id', ItemCtrl.getOneItem);
// edit item
router.put('/item/:id', fileUpload.single('image'), auth, ItemCtrl.modifyItem);
// delete an item
router.post('/item/remove/:id', auth, ItemCtrl.deleteItem);
router.get('/items/:id', ItemCtrl.getAllItemsByUser);
// search items
router.get('/s/search?', ItemCtrl.searchItems);

// pagination for men women sneakers shop items
router.get('/page/:page/:query', ItemCtrl.getPaginationItems);
router.get('/page/:page', ItemCtrl.getPaginationsForShop);

module.exports = router;
