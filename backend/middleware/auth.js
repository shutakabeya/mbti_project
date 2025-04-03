const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: '管理者権限が必要です' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '認証に失敗しました' });
  }
};

module.exports = { isAdmin }; 