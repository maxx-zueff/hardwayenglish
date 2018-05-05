let request = require('../models/request');

let cookie = {

	set: function(name, value, expires) {
    
	    if (typeof expires == "number") {
	        let d = new Date(expires * 1000);
	        expires = d.toUTCString();
	    }

	    let updatedCookie = name + "=" + value;
	        updatedCookie += "; expires=" + expires;

	    document.cookie = updatedCookie;
	},

	remove: function(name) {

		document.cookie = name+'=; Max-Age=-99999999;'; 
	}

};

module.exports = cookie;