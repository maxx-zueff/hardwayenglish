const store = require('../models/store');
const listener = require('../controllers/listeners');

module.exports = function() {

	let nodes = store.DOM();
	nodes.select.forEach(function(el) {

		let node = el.querySelector('.menu-form__field');

		listener.add(el, 'click', function () {
			el.setAttribute("type", "selected");
			node.focus();
		});

		listener.add(node, 'focus', function () {
			el.setAttribute("type", "selected");
		});

		listener.add(node, 'blur', function () {
			if (!node.value) el.removeAttribute("type");
			else el.setAttribute('type', 'complete');
		});

	});
};