// *** main dependencies *** //
require('dotenv').load();
var config = require('../_config.js');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');


// *** routes *** //
var routes = require('./routes/index.js');
var tutorialRoutes = require('./routes/tutorialApi.js');
var userNoteRoutes = require('./routes/userNotes.js');
var userRoutes = require('./routes/users.js');


// *** express instance *** //
var app = express();

// *** mongoose *** //
var mongoURI = process.env.MONGOLAB_URI || config.mongoURI[app.settings.env];
mongoose.connect(mongoURI, function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//defines where to load the static html files from
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
  secret: process.env.secretKey,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// *** main routes *** //
app.use('/', routes);
app.use('/usertutorials/', tutorialRoutes);
app.use('/usernotes/', userNoteRoutes);
app.use('/users/', userRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
