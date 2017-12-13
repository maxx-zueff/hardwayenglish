const request = {

	// made private method!!
	open: function(url, data, callback) {

		callback = typeof callback == 'function' ? callback : data;
		data = typeof data == 'function' ? null : data;

		let req = new XMLHttpRequest();
		req.open('post', url);

		req.send(data);
		
		req.onload = function() {
			if (req.status == 404) return callback(null); 
			callback(this.response);
		};
	},

	data: function(url, data) {

	},

	block: function(path, callback) {

		let url = `/block${path}`;
		request.open(url, function(data) {

			// REDIRECT TO ERROR PAGE (IF GETED ERROR)
			if (!data) return window.location.replace("/sorry");

			// return HTML document
			callback(data);
		});
	}
};

module.exports = request;