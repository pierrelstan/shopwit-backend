const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        msg: 'No token, authorization denied',
      });
    }
    next();
  } catch (error) {
    res.status(401).json({ msg: error });
  }
};
