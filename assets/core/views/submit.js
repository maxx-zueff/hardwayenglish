const store = require('../models/store');
const listener = require('../controllers/listeners');

const options = {
	"auth" : require('../models/auth').init,
	"logout" : require('../models/auth').out
};

module.exports = function() {

	let nodes = store.DOM();
	nodes.submit.forEach(function(el) {

		let type = el.getAttribute("type");
		let submit = options[type];

		listener.add(el, 'click', function () {
			submit(el);
		});

	});
};