const listener = require('../controllers/listeners');
const store    = require('../models/store');

module.exports = function () {
	
const location = require('../controllers/location');

	let link = store.nodes.link();
	link.forEach(function(el) {

		console.log(el);

		let ref = el.getAttribute('href');
		listener.add(el, 'click', function(event) {
			event.preventDefault();
			location(ref);
		});

	});

};