
// Dependensies
const http       = require('http');
const express    = require('express');
const logger     = require('morgan');
const bodyparser = require('body-parser');
const jwt        = require('jsonwebtoken'); 

require('./models/db');
require('./controllers/passport');

// ------------------------------------------------------------------

// Server
const port    = process.env.PORT || 8080;
const app     = express();
const server  = http.createServer(app);

// ------------------------------------------------------------------

//Routes
const auth   = require('./routes/auth');
const view   = require('./routes/view');
const admin  = require('./routes/admin');

// ------------------------------------------------------------------

// View engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// ------------------------------------------------------------------

// Middleware function handles
var check_token = function (req, res, next) {
  if (req.body && req.body.token) {
      req.user = jwt.verify(req.body.token, 'LOVE');
      return next();
  }

  return next();
};

// ------------------------------------------------------------------

// Middleware for every path
app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(check_token);

// ------------------------------------------------------------------

// Middleware for specific path
app.use(auth);
app.use(view);
app.use(admin);

// ------------------------------------------------------------------

// Error handlers

// Development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// ------------------------------------------------------------------

// Server listener
server.listen(port, function() {
  console.log( 'http://localhost:' + port 
    + ' : server has been launched' );
});
