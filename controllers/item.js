const Item = require('../models/item');
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const User = require('../models/user');
const TakeMyMoney = require('../utils/TakeMyMoney');
const cloudinary = require('../middleware/cloudinary');

const { ObjectId } = require('bson');

exports.createProduct = async (req, res, next) => {
  const { title, quantity, description, gender, image } = req.body;
  let filePath = req.file && req.file.path;
  let money = TakeMyMoney(req.body.price);
  if (filePath) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'ecommerce',
    });

    let item = new Item({
      gender: gender,
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
  }

  let item = new Item({
    gender: gender,
    title: title,
    description: description,
    imageUrl: image,
    cloudinary_id: '',
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
    .limit(8)
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
  let pipeline = [
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
    {
      $unwind: {
        path: '$ratings',
      },
    },
    {
      $group: {
        _id: '$_id',
        count: {
          $sum: 1,
        },
        totalRatings: {
          $sum: '$ratings.rating',
        },
        item: {
          $push: {
            _id: '$_id',
            title: '$title',
            description: '$description',
            imageUrl: '$imageUrl',
            cloudinary_id: '$cloudinary_id',
            price: '$price',
            quantityProducts: '$quantityProducts',
            userId: '$userId',
          },
        },
      },
    },
    {
      $sort: {
        totalratings: -1,
      },
    },
    {
      $limit: 5,
    },
  ];

  Item.aggregate(pipeline)
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
  let query = req.params.query;
  let ITEM_PER_PAGE = 8;
  let page = parseInt(req.params.page);
  let skip = (page - 1) * ITEM_PER_PAGE;
  if (query) {
    Item.find({
      gender: query,
    })
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
  }
};

exports.getPaginationsForShop = (req, res, next) => {
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
  try {
    let id = req.params.id;
    let queryItem = await Item.findById(id);
    let obj = JSON.parse(JSON.stringify(req.body));

    let filePath = req.file && req.file.path;
    if (filePath) {
      await cloudinary.uploader.destroy(queryItem.cloudinary_id);
      const result = await cloudinary.uploader.upload(filePath, {
        upload_preset: 'ecommerce',
      });

      let money = TakeMyMoney(obj.price || queryItem.price);
      const item = {
        _id: id,
        title: obj.title || queryItem.title,
        description: obj.description || queryItem.description,
        gender: obj.gender || queryItem.gender,
        price: money,
        imageUrl: result.secure_url,
        cloudinary_id: result.public_id || queryItem.cloudinary_id,
        quantityProducts: obj.quantity || queryItem.quantityProducts,
        userId: req.user.userId || queryItem.userId,
      };
      await Item.findByIdAndUpdate(req.params.id, item, {
        new: true,
      }).lean();
      return res.status(201).json({
        message: 'Item Updated successfully!',
      });
    }
    let money = TakeMyMoney(obj.price || queryItem.price);
    const item = {
      _id: id,
      title: obj.title || queryItem.title,
      description: obj.description || queryItem.description,
      gender: obj.gender || queryItem.gender,
      price: money,
      imageUrl: obj.image,
      cloudinary_id: queryItem.cloudinary_id,
      quantityProducts: obj.quantity || queryItem.quantityProducts,
      userId: req.user.userId || queryItem.userId,
    };
    let newItem = await Item.findByIdAndUpdate(req.params.id, item, {
      new: true,
    }).lean();
    return res.status(201).json({
      message: 'Item Updated successfully!',
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.deleteItem = async (req, res, next) => {
  let itemById = await Item.findById({ _id: req.params.id }).lean();
  await cloudinary.uploader.destroy(itemById.cloudinary_id);

  try {
    await Item.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    }).lean();
  } catch (error) {
    res.status(400).json({
      error: error,
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
    },
  ).lean();
};

exports.queryCountTypes = (req, res, next) => {
  const pipeline = [
    {
      $facet: {
        Women: [
          {
            $match: {
              gender: 'women',
            },
          },
          {
            $count: 'Women',
          },
        ],
        Men: [
          {
            $match: {
              gender: 'men',
            },
          },
          {
            $count: 'Men',
          },
        ],
        Sneakers: [
          {
            $match: {
              gender: 'sneakers',
            },
          },
          {
            $count: 'Sneakers',
          },
        ],
      },
    },
    {
      $project: {
        Men: {
          $arrayElemAt: ['$Men.Men', 0],
        },

        Sneakers: {
          $arrayElemAt: ['$Sneakers.Sneakers', 0],
        },
        Women: {
          $arrayElemAt: ['$Women.Women', 0],
        },
      },
    },
  ];

  Item.aggregate(pipeline)
    .then((items) => {
      let arr = Object.values(items[0]);
      res.status(201).json(arr);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
