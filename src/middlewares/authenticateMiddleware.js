// middleware/auth.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/users'); // chỉnh path nếu cần
require('dotenv').config();
module.exports = async function (req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      req.user = null;
      res.locals.user = null;
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verify error:', err);
      // Xóa cookie token để tránh lặp lỗi
      res.clearCookie('token');
      req.user = null;
      res.locals.user = null;

      if (err.name === 'TokenExpiredError') {
        return res.status(401).render('pages/error', { error: 'Token đã hết hạn, vui lòng đăng nhập lại' });
      } else {
        return res.status(401).render('pages/error', { error: 'Token không hợp lệ, vui lòng đăng nhập lại' });
      }
    }

    // Lấy thông tin user mới nhất từ DB (loại password)
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      res.clearCookie('token');
      req.user = null;
      res.locals.user = null;
      return res.status(401).render('pages/error', { error: 'Tài khoản không tồn tại' });
    }

    // Gán req.user và res.locals.user (dùng trong EJS)
    req.user = user; // Chuyển đổi Mongoose document sang object thường
    res.locals.user = req.user;

    return next();
  } catch (err) {
    console.error('Auth middleware unexpected error:', err);
    req.user = null;
    res.locals.user = null;
    return res.status(500).render('pages/error', { error: 'Lỗi xác thực, vui lòng thử lại' });
  }
};
