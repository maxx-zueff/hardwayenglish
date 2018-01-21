const listener = require('../controllers/listeners');
const store    = require('../models/store');

module.exports = function () {
	
const location = require('../controllers/location');

	let nodes = store.DOM();
	nodes.link.forEach(function(el) {

		let ref = el.getAttribute('href');
		listener.add(el, 'click', function(event) {
			event.preventDefault();
			location(ref);
		});

	});

};