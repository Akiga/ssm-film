const homeRouter = require('./home')
const personalRouter = require('./personal');
function route(app) {
  app.use('/', homeRouter);
  app.use('/personal', personalRouter);
}

module.exports = route;