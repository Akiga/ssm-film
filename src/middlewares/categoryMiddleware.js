const { getCategory } = require('../services/phimService');

async function categoryMiddleware(req, res, next) {
  try {
    res.locals.category = await getCategory();
  } catch (err) {
    console.error('Lỗi lấy thể loại:', err.message);
    res.locals.category = []; // gán mảng rỗng để EJS không lỗi
  }
  next();
}

module.exports = categoryMiddleware;