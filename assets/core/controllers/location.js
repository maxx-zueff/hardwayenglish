const request  = require('../models/request');
const section  = require('../views/section');
const listener = require('../controllers/listeners');

module.exports = function(url, callback) {

	if (typeof callback != 'function') {
		callback = url; url = null;
	}

	// Prevent automatic browser scroll on refresh
	window.onbeforeunload = function() { 
		window.scrollTo(0,0);
	};

	// Change address bar 
	history.pushState(null, null, url);
	let path = location.pathname;
	
	// Send request (block)
	request.block(path, function(block) {

		listener.remove_all(); // remove old listeners
		section.up(block, function() { // update HTML
			callback();
		});

	});
};

