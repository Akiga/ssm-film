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

// Method override for PUT and DELETE
app.use(methodOverride('_method'))
// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// Cookie parser
app.use(cookieParser());

// Connect to DB
db.connectDB();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Custom middlewares
app.use(categoryMiddleware)
app.use(countryMiddleware)
app.use(toast);
app.use(authen);

route(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});