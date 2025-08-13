const {getCountry } = require('../services/phimService');



async function countryMiddleware(req, res, next) {
  try {
    res.locals.countries = await getCountry();
  } catch (err) {
    console.error('Lỗi lấy thể loại:', err.message);
    res.locals.country = []; // gán mảng rỗng để EJS không lỗi
  }
  next();
}

module.exports = countryMiddleware;
