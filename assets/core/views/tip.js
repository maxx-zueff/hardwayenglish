const store    = require('../models/store');
const auth     = require('../models/auth');
const check    = require('../models/check_field');
const listener = require('../controllers/listeners');

module.exports = function() {
	
	let nodes = store.DOM();
	nodes.tip.forEach(function(el) {

		listener.add(el, 'keyup', function (event) {

			console.log('keyup');

			let node = document
				.querySelector('.menu-form__item[type="selected"]');
			let tip = node.querySelector('.menu-form__tip');
			let section = node.parentNode.getAttribute("type");
			
			let value = el.value;
			let type = el.getAttribute('type');

			check(type, value, section, function(string, type) {

				if (type == "email" && string) {

					nodes.menu.setAttribute("type", "signin");
					let form = nodes.menu.querySelector('.menu-form[type="signin"]');
					let field = form.querySelector('.menu-form__field[type="username"]');
					let item = field.parentNode.parentNode;

					setTimeout(function(){
						item.click();
						field.value = value;
						item.setAttribute('status', 'success');
					}, 250);
				}

				if (string) {
					node.setAttribute('status', 'error');
					tip.innerHTML = string;
				}

				else if (!string) {
					node.setAttribute('status', 'success');
				}

			});

		});		

	});
};