var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');

var setUpPassport = require('./setuppassport'); // Set up passport for user authentication

var index = require('./routes/index');
var home = require('./routes/home');
var leagues = require('./routes/leagues');
var matchterminal = require('./routes/matchterminal');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Set up passport for user authentication
setUpPassport();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "osixes2018=!@KingSton&overwatch%#&@%!!VV",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize()); // Initialize passport module
app.use(passport.session());  // Handle passport sessions

app.use('/', index);
app.use('/home', home);
app.use('/leagues', leagues);
app.use('/matchterminal', matchterminal);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
