require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
const route = require('./routes');
const categoryMiddleware = require('./middlewares/categoryMiddleware')
const countryMiddleware = require('./middlewares/countryMiddleware')
const toast = require('./middlewares/toastMiddleware');
const authen = require('./middlewares/authenticateMiddleware');
const db = require('./config/config');

app.use(methodOverride('_method'))
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(cookieParser());
db.connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(categoryMiddleware)
app.use(countryMiddleware)
app.use(toast);
app.use(authen);

route(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});