const listener = require('../controllers/listeners');

module.exports = function(select) {

	select.forEach(function(el) {

		let node = el.querySelector('input');

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