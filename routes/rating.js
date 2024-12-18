const express = require('express');
const router = express.Router();

const RatingCtrl = require('../controllers/rating.js');
const auth = require('../middleware/auth');

router.get('/', RatingCtrl.queryAllRatingsAverage);
router.get('/rates/:id', auth, RatingCtrl.findRatingsByUserId);
router.post('/:id', auth, RatingCtrl.createRatingItem);

module.exports = router;
