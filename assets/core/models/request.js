const request = {

	// made private method!!
	open: function(url, data, callback) {

		callback = typeof callback == 'function' ? callback : data;
		data = typeof data == 'function' ? null : data;

		let req = new XMLHttpRequest();
		req.open("POST", url, true);
		req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		req.send(JSON.stringify(data));
		
		req.onload = function() {
			if (req.status == 404) return callback(null); 
			callback(this.response);
		};
	},

	data: function(url, data, callback) {
		request.open(url, data, function(res) {
			callback(JSON.parse(res));
		});
	},

	block: function(path, callback) {

		let url = `/blocks${path}`;
		request.open(url, function(data) {

			// REDIRECT TO ERROR PAGE (IF GETED ERROR)
			if (!data) return window.location.replace("/sorry");

			// return HTML document
			callback(data);
		});
	}
};

module.exports = request;