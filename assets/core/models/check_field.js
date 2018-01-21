const auth     = require('../models/auth');

module.exports = function(type, value, section, cb) {

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

	let check = check_field(value);
	if (check) return cb(check);

	if (section == "signup") {
		
		if (type == "password") {
			
			let check = check_field(value, {
				name: 'Password',
				max: 15,
				min: 6
			});

			if (check) return cb(check);
		}

		auth.available(type, value, function(status) {
			
			if (type == "username") {

				if (!status) return cb('Taken ' + type);
				
				let check = check_field(value, {
					name: 'Username',
					regex: /^[a-zA-Z0-9]{3,15}$/,
					max: 15,
					min: 3
				});

				if (check) return cb(check);
				return cb(false);
			}

			if (type == "email") {
				if (!status) return cb(true, "email");
				return cb(false);
			}

		});
	}
	
	return cb(false);

};