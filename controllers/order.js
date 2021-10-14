const Order = require('../models/order');
const Cart = require('../models/cart');
const Item = require('../models/item');
const { ObjectId } = require('bson');
const stripe = require('stripe')(process.env.SECRET_KEY);

exports.createOrder = async (req, res, next) => {
  try {
    const { cartIds, id, IdItems } = req.body;

    let uniqueItems = [...new Set(IdItems)];

    if (!req.user.userId) {
      res.status(404).json({
        errors: [{ msg: 'You must sign in to complete this order' }],
      });
    }

    let carts = await Cart.find({
      _id: {
        $in: cartIds,
      },
    }).populate({
      path: 'item',
      model: 'Item',
    });
    let mapPriceTotal = await carts.map((cart) => {
      return cart.quantity * cart.item.price;
    });
    let priceTotal = await mapPriceTotal.reduce((a, b) => {
      return a + b;
    }, 0);
    let order = await new Order({
      userId: req.user.userId,
      carts: uniqueItems,
      subTotal: priceTotal,
    });
    order.save();

    // stripe payment

    const PAYMENTS_INTENTS = await stripe.paymentIntents.create({
      amount: priceTotal * 100,
      currency: 'USD',
      description: 'shopwit cart',
      payment_method: id,
      confirm: true,
    });

    res.status(200).json(PAYMENTS_INTENTS.client_secret);
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

exports.findOrderByUserId = async (req, res, next) => {
  let id = req.params.id;

  try {
    let ORDER = await Order.find({ userId: ObjectId(id) })
      .sort('-created')
      .populate({
        path: 'carts',
        model: 'Item',
      });
    res.status(201).json(ORDER);
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};
