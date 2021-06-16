const Order = require('../models/order');
const Cart = require('../models/cart');
const Item = require('../models/item');
const cart = require('../models/cart');
const stripe = require('stripe')(process.env.SECRET_KEY);
const nodeId = require('node-id');

exports.createOrder = async (req, res, next) => {
    // calculate the price total
    const idempontencyKey = nodeId();

    const { id, amount, token } = req.body;
    console.log(req);

    if (!req.user.userId) {
        res.status(404).json({
            errors: [{ msg: 'You must sign in to complete this order' }],
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
        let customers = await stripe.customer.create({
            email: token.email,
            source: token.id,
        });

        try {
            let results = await customers.charges.create(
                {
                    amount: priceTotal * 100,
                    currency: 'usd',
                    payment_method: id,
                    confirm: true,
                    customer: results.id,
                    receipt_email: token.email,
                    shipping: {
                        name: token.card.name,
                        address: {
                            country: token.card.address_country,
                        },
                    },
                },
                {
                    idempontencyKey,
                }
            );
            console.log(results);
            res.status(200).json(results);
        } catch (err) {}
        order.save();
        // res.status(200).json({
        //     paymentIntent,
        // });
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

exports.findOrderByUserId = async (req, res, next) => {
    let id = req.user.userId;
    let order = Order.find({ userId: id });

    order.populate({
        path: 'carts.item',
        model: 'Item',
    });

    order
        .then((order) => {
            res.status(201).json(order);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};
