// middleware/role.js
module.exports = function(req, res, next) {
    if (!req.user) {
      return res.render('pages/error', { error: 'Bạn chưa đăng nhập' });
    }

    if (req.user.role != 'admin') {
      return res.render('pages/error', { error: 'Bạn không có quyền truy cập trang này' });
    }

    next();
};
