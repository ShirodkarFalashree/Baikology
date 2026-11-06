const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        detail: 'Authentication token is missing. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'baikology-secret-key-change-in-production';

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      detail: 'Invalid or expired session. Please log in again.',
    });
  }
};
