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
router.get('/:id', ItemCtrl.getOneItem);
// edit item
router.put('/:id', fileUpload.single('image'), auth, ItemCtrl.modifyItem);
// delete an item
router.delete('/:id', auth, ItemCtrl.deleteItem);
router.get('/items/:id', ItemCtrl.getAllItemsByUser);
// search items
router.get('/s/search?', ItemCtrl.searchItems);

// pagination items
router.get('/page/:page', ItemCtrl.getPaginationItems);
// pagination for male female children items
router.get('/page/m/:page', ItemCtrl.queryMaleItems);
router.get('/page/f/:page', ItemCtrl.queryFemaleItems);
router.get('/page/c/:page', ItemCtrl.queryChildrenItems);

module.exports = router;
