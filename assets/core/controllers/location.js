const request   = require('../models/request');
const section   = require('../views/section');
const listeners = require('../controllers/listeners');

module.exports = function(url) {
	
	// Change address bar 
	history.pushState(null, null, url);
	let path = location.pathname;
	
	// Send request (block)
	request.block(path, function(block) {

		listeners.remove(); // remove old listeners
		section.up(block, function() { // update HTML

			listeners.add(); // Add new listeners

		});

	});
};

