module.exports = (req, res, next) => {
  res.locals.successMessage = req.session.successMessage || null;
  res.locals.errorMessage = req.session.errorMessage || null;
  res.locals.openModal = req.session.openModal || false;
  res.locals.openModalRegister = req.session.openModalRegister || false;

  // Xóa sau khi gán
  req.session.successMessage = null;
  req.session.errorMessage = null;
  req.session.openModal = false;
  req.session.openModalRegister = false;

  next();
};