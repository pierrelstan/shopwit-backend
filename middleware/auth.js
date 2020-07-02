const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // console.log(req);
  const token = req.header('x-auth-token');
  // console.log(req.headers.authorization);
  if (!token) {
    // console.log(token);
    return res.status(401).json({
      msg: 'No token, authorization denied',
    });
  }
  try {
    // verify token

    const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user = decodeToken.user;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      msg: 'Token not valid',
    });
  }
};
