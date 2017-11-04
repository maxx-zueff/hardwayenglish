var mongoose = require('mongoose');
var db_uri = 'mongodb://localhost/type_eng';

// CONNECT TO DATABASE
mongoose.connect(db_uri);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + db_uri);
});

mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// BRING IN MODELS
require('./user');
require('./topic');
require('./rule');
require('./group');