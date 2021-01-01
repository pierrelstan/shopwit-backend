const express = require('express');
const router = express.Router();
const FavoritesCtrl = require('../controllers/favorites.js');

const auth = require('../middleware/auth');

router.post('/add-to-favorites/:id', auth, FavoritesCtrl.addToFavorites);
router.get('/favorites/:id', auth, FavoritesCtrl.findFavoritesByUserId);
router.post('/removeFavorites/:id', auth, FavoritesCtrl.removeFavoritesById);

module.exports = router;
