
// Dependensies
const http       = require('http');
const express    = require('express');
const logger     = require('morgan');
const bodyparser = require('body-parser');

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

// ------------------------------------------------------------------

// View engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// ------------------------------------------------------------------

// Middleware for every path
app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// ------------------------------------------------------------------

// Middleware for specific path
app.use(auth);
app.use(view);

// ------------------------------------------------------------------

// Error handlers

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
