const Item = require('../models/item');
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const User = require('../models/user');
const TakeMyMoney = require('../utils/TakeMyMoney');
const cloudinary = require('../middleware/cloudinary');

const { ObjectId } = require('bson');

exports.createProduct = async (req, res, next) => {
    const { genre, title, quantity, description } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'ecommerce',
    });
    let money = TakeMyMoney(req.body.price);
    let item = new Item({
        genre: genre,
        title: title,
        description: description,
        imageUrl: result.secure_url,
        cloudinary_id: result.public_id,
        price: money,
        quantityProducts: quantity,
        userId: req.user.userId,
    });
    item.save((error, data) => {
        if (error) {
            res.status(400).json({
                error: error,
            });
        } else {
            res.status(201).json({
                message: 'Item create successfully!',
            });
        }
    });
};

exports.getOneItem = (req, res, next) => {
    const pipeline = [
        {
            $match: {
                _id: ObjectId(req.params.id),
            },
        },
        {
            $lookup: {
                from: 'ratings',
                let: {
                    id: '$_id',
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$item', '$$id'],
                            },
                        },
                    },
                    {
                        $project: {
                            rating: 1,
                        },
                    },
                ],
                as: 'ratings',
            },
        },
    ];

    Item.aggregate(pipeline)
        .then((item) => {
            res.status(200).json(item[0]);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.getAllItem = (req, res, next) => {
    Item.find({})
        .sort('-created')
        .lean()
        .then((items) => {
            res.status(200).json(items);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.getHeigthlastItems = (req, res, next) => {
    Item.find({})
        .limit(8)
        .sort('-created')
        .lean()
        .then((items) => {
            res.status(201).json(items);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.getPaginationItems = (req, res, next) => {
    let ITEM_PER_PAGE = 8;
    let page = parseInt(req.params.page);
    let skip = (page - 1) * ITEM_PER_PAGE;
    Item.find()
        .skip(skip)
        .limit(ITEM_PER_PAGE)
        .sort('-created')
        .then((items) => {
            return res.status(200).json(items);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.modifyItem = async (req, res, next) => {
    let money = TakeMyMoney(req.body.price);
    let id = req.params.id;
    const result = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'ecommerce',
    });
    const item = new Item({
        _id: id,
        title: req.body.title,
        description: req.body.description,
        price: money,
        imageUrl: result.secure_url,
        cloudinary_id: result.public_id,
        quantityProducts: req.body.quantity,
        userId: req.user.userId,
    });
    Item.updateOne(
        {
            _id: req.params.id,
        },
        item
    )
        .lean()
        .then(() => {
            res.status(201).json({
                message: 'Item Updated successfully!',
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.deleteItem = async (req, res, next) => {
    let itemById = await Item.findById({ _id: req.params.id }).lean();
    await cloudinary.uploader.destroy(itemById.cloudinary_id);

    let { userId } = itemById;
    if (userId.equals(req.user.userId)) {
        try {
            await Item.findOneAndDelete({
                _id: req.params.id,
            });
        } catch (error) {
            res.status(400).json({
                error: error,
            });
        }
    } else {
        res.status(400).json({
            error: 'Item not belongs to you , access denied!',
        });
    }
};

exports.getAllItemsByUser = (req, res, next) => {
    Item.find({ userId: req.params.id })
        .sort('-created')
        .lean()
        .then((item) => {
            res.status(200).json(item);
        })
        .catch((err) => {
            res.status(400).json({
                err: err,
            });
        });
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

exports.searchItems = (req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    const regex = new RegExp(escapeRegex(req.query.title), 'gi');
    Item.find(
        {
            title: regex,
        },
        function (err, items) {
            if (err) res.status(401).json(err);
            else {
                res.status(201).json(items);
            }
        }
    ).lean();
};
