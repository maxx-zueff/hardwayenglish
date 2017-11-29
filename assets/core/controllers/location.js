const request = require('../models/request');

module.exports.bar = function(url) {
	
	// Change address bar 
	history.pushState(null, null, url);
	let path = location.pathname;
	
	// Send request (block)
	request.block(path);
	
};

module.exports.link = function() {

};