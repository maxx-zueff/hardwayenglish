// Bundle for group of users the guest  

const location = require('./controllers/location');
const listener = require('./controllers/listeners');

// ------------------------------------------------------------------

// Get view block
location(function () {

	// Определить listeners для member

	// Add new listeners
	listener.init();
});