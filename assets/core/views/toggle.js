const store = require('../models/store');
const listener = require('../controllers/listeners');

module.exports = function() {

	let nodes = store.DOM();
	nodes.toggled.forEach(function(el) {

		let set = el.getAttribute('set');
		let target = el.getAttribute('target');

		let node = document.querySelector(target);
		let classes = node.classList;

		listener.add(el, 'click', function () {
			classes.toggle(set);
		});


	});

};