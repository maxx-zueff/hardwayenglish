const store    = require('../models/store');
const auth     = require('../models/auth');
const listener = require('../controllers/listeners');

module.exports = function() {

	
	let check_field = function(value, options) {

		if (value.length == 0) return "Field must be complete!";
		if (typeof options == "undefined") return false;
		
		if (options.min && options.max) {
			if (value.length < options.min) return options.name + " is too short (minimum is " + options.min + " characters)";
			if (value.length > options.max) return options.name + " is too long (maximum is " + options.max + " characters)";
		}

		if (options.regex) {
			let match = value.match(options.regex);
			if (match == null) return options.name + " may only contain alphanumeric characters";
		}

		return false;
	};

	let check_symbols = function(type, value, section, cb) {

		let check = check_field(value);

		if (check) return cb(check);
		if (section == "signup") {
			
			if (type == "username") {

				let check = check_field(value, {
					name: 'Username',
					regex: /^[a-zA-Z0-9]{3,15}$/,
					max: 15,
					min: 3
				});

				if (check) return cb(check);
				if (auth.available(type, value)) {
					return cb('Taken ' + type);
				}

				return cb(false);
			}

			if (type == "email") {

				if (auth.available(type, value)) {
					return cb(true, type);
				}
			}

			if (type == "password") {
				
				let check = check_field(value, {
					name: 'Password',
					max: 15,
					min: 6
				});

				if (check) return cb(check);
			}

		}
		
		return cb(false);

	};
	
	let nodes = store.DOM();
	nodes.tip.forEach(function(el) {

		listener.add(el, 'keyup', function (event) {

			let node = document
				.querySelector('.menu-form__item[type="selected"]');
			let tip = node.querySelector('.menu-form__tip');
			let section = node.parentNode.getAttribute("type");
			let value = el.value;
			let type = el.getAttribute('type');

			check_symbols(type, value, section, function(string, type) {


				if (type == "email" && string) {
					nodes.menu.setAttribute("type", "login");
					let form = nodes.menu.querySelector('.menu-form[type="login"]');
					let field = form.querySelector('.menu-form__field[type="username"]');
					let item = field.parentNode.parentNode;

					setTimeout(function(){
						item.click();
						field.value = value;
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