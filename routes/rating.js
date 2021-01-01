const express = require('express');
const router = express.Router();

const RatingCtrl = require('../controllers/rating.js');

router.post('/', RatingCtrl.createRatingItem);
module.exports = router;
