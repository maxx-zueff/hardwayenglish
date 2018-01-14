const request  = require('../models/request');
const section  = require('../views/section');
const listener = require('../controllers/listeners');

module.exports = function(url) {

	// Change address bar 
	history.pushState(null, null, url);
	let path = location.pathname;
	
	// Send request (block)
	request.block(path, function(block) {

		listener.remove_all(); // remove old listeners
		section.up(block, function() { // update HTML
			listener.init(); // add new listeners
		});

	});
};

