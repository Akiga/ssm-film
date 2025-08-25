const homeRouter = require('./home')
const personalRouter = require('./personal');
const adminRouter = require('./admin');
const isAdmin = require('../middlewares/isAdminMiddleware')
function route(app) {
  app.use('/', homeRouter);
  app.use('/personal', personalRouter);
  app.use('/admin', isAdmin, adminRouter);
}

module.exports = route;