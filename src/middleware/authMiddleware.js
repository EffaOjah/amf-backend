const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'amf_super_secret_key_2026';

exports.protect = (req, res, next) => {
  let token;

  // Check headers for authorization token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // We can attach the admin user to the request if needed
      req.admin = decoded;
      
      next();
    } catch (error) {
      console.error('Auth token failed', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
