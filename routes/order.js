const express = require('express');
const router = express.Router();

const OrderCtrl = require('../controllers/order');
const auth = require('../middleware/auth');

router.post('/payment_intents', auth, OrderCtrl.createOrder);
router.get('/:id', auth, OrderCtrl.findOrderByUserId);

module.exports = router;
