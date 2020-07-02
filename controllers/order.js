const Order = require('../models/order');
const Cart = require('../models/cart');
const Item = require('../models/item');
const cart = require('../models/cart');
// const stripe = new Stripe(process.env.SECRET_KEY);
const stripe = require('stripe')('sk_test_USGZY9bUOfSyGUeOylzGsLlQ00mZABItJI');

exports.createOrder = async (req, res, next) => {
  // calculate the price total
  const {id, amount} = req.body;

  if (!req.user.userId) {
    res.status(404).json({
      errors: [{msg: 'You must sign in to complete this order'}],
    });
  }

  let carts = await Cart.find({
    userId: req.user.userId,
  });

  let mapPriceTotal = await carts.map((cart) => {
    return cart.quantity * cart.item.price;
  });
  let priceTotal = await mapPriceTotal.reduce((a, b) => {
    return a + b;
  }, 0);

  let order = await new Order({
    userId: req.user.userId,
    carts: [...carts],
    subTotal: priceTotal,
  });

  // .console.log(order);

  // / Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  // if its a whole, dollar amount, leave off the .00

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceTotal * 100,
      currency: 'usd',
      payment_method: id,
      confirm: true,
    });
    console.log(order);
    order.save();
    res.status(200).json({
      paymentIntent,
    });
  } catch (err) {
    res.status(500).json({statusCode: 500, message: err.message});
  }
};

exports.findOrderByUserId = async (req, res, next) => {
  let id = req.user.userId;
  let order = Order.find({userId: id});

  order.populate({
    path: 'carts.item',
    model: 'Item',
  });

  order
    .then((order) => {
      let a;
      for (let i of order) {
        a = i.carts;
      }
      res.status(201).json(a);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
