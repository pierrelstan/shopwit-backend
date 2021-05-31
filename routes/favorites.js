const express = require('express');
const router = express.Router();
const FavoritesCtrl = require('../controllers/favorites.js');
const auth = require('../middleware/auth');

router.post('/:id', auth, FavoritesCtrl.addToFavorites);
router.get('/:id', auth, FavoritesCtrl.findFavoritesByUserId);
router.post('/remove/:id', auth, FavoritesCtrl.removeFavoritesById);

module.exports = router;
