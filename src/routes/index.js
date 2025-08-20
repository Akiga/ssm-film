const homeRouter = require('./home')
const personalRouter = require('./personal');
const adminRouter = require('./admin');
function route(app) {
  app.use('/', homeRouter);
  app.use('/personal', personalRouter);
  app.use('/admin', adminRouter);
}

module.exports = route;