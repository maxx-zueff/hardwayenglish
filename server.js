
// Dependensies
const http         = require('http');
const express      = require('express');
const logger       = require('morgan');
const bodyparser   = require('body-parser');
const jwt          = require('jsonwebtoken'); 
const cookieparser = require('cookie-parser');

require('./models/db');
require('./controllers/passport');

// ------------------------------------------------------------------
// Server

const port    = process.env.PORT || 8080;
const app     = express();
const server  = http.createServer(app);

// ------------------------------------------------------------------
//Routes

const users  = require('./routes/users');
const layout = require('./routes/view.layout');
const blocks = require('./routes/view.blocks');
const admin  = require('./routes/admin');

// ------------------------------------------------------------------
// View engine

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// ------------------------------------------------------------------
// Middleware function handles

function check_token (req, res, next) {
  if (req.body && req.body.token) {
      req.user = jwt.verify(req.body.token, 'LOVE');
      return next();
  }

  if (req.cookies && req.cookies.token) {
      req.user = jwt.verify(req.cookies.token, 'LOVE');
      return next();
  }

  return next();
}

function not_found (req, res, next) {
  next({
    status: 404,
    message: '404: Not Found'
  });
}

function error_handler (err, req, res, next) {
  res.status(err.status || 500);
  
  if (res.status == 404) {
    res.render('error', {
      message: err.message
    });
  }
  
  else {
    res.json(err);
  }
}

// ------------------------------------------------------------------
// Middleware for every path

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.static(__dirname + '/public'));
app.use(check_token);

// ------------------------------------------------------------------
// Middleware for specific path

app.use(users);
app.use(admin);
app.use(layout);
app.use('/block', blocks);

// Error handler for paths
app.use(not_found);
app.use(error_handler);

// ------------------------------------------------------------------
// Server listener

server.listen(port, function() {
  console.log( 'http://localhost:' + port 
    + ' : server has been launched' );
});
