const store    = require('../models/store');
const auth     = require('../models/auth');
const listener = require('../controllers/listeners');

module.exports = function() {

	let nodes = store.DOM();
	let check_symbols = function(type, value, section, cb) {

		if (value.length == 0) return cb("Field must be complete!");

		if (section == "signup") {

			if (type == "username") {
				let name_regex = /^[a-zA-Z0-9]{3,15}$/;
				let match = value.match(name_regex);
			    
			    if (value.length < 3) return cb("Username is too short (minimum is 3 characters)");
				else if (value.length > 15) return cb("Username is too long (maximum is 15 characters)");
				else if (match == null) return cb("Username may only contain alphanumeric characters");

				auth.available(type, value, function(status) {
					if (!status) return cb('Taken ' + type);
					if (status) return cb(false);
				});
			}

			if (type == "email") {

				auth.available(type, value, function(status) {
					if (!status) {
						nodes.menu.setAttribute("type", "login");
						let form = nodes.menu.querySelector('.menu-form[type="login"]');
						let field = form.querySelector('.menu-form__field[type="username"]');
						let node = field.parentNode.parentNode;

						setTimeout(function(){
							node.click();
							field.value = value;
						}, 250);
						return cb(false);
					}

					if (status) return cb(false);
				});
			}

			if (type == "password") {
			    if (value.length < 6) return cb("Password is too short (minimum is 6 characters)");
				if (value.length > 15) return cb("Password is too long (maximum is 15 characters)");
				return cb(false);
			}

		}
		
		return cb(false);

	};



	
	nodes.tip.forEach(function(el) {

		listener.add(el, 'keyup', function (event) {

			let node = document
				.querySelector('.menu-form__item[type="selected"]');
			let tip = node.querySelector('.menu-form__tip');
			let section = node.parentNode.getAttribute("type");
			let value = el.value;
			let type = el.getAttribute('type');

			check_symbols(type, value, section, function(string) {

				if (string) {
					node.setAttribute('status', 'error');
					tip.innerHTML = string;
				}

				else {
					node.setAttribute('status', 'success');
				}

			});

		});		

	});
};