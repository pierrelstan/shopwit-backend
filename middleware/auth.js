const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({
      msg: 'No token, authorization denied',
    });
  }
  try {
    // verify token
    const decodeToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const user = decodeToken.user;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: error });
  }
};
