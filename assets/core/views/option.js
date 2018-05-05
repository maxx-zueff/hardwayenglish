const listener = require('../controllers/listeners');

module.exports = function(option) {

	if (!option) return false;
	option.forEach(function(el) {

		let set = el.getAttribute('type');
		let target = el.getAttribute('target');
		let node = document.querySelector(target);

		listener.add(el, 'click', function () {
			node.setAttribute("type", set);
		});

	});
};