module.exports = {

	up: function(data, callback) {
		document.getElementById("view").innerHTML = data;
		callback(null);
	},

	add: function(data, callback) {
		document.getElementById("view").appendChild(data);
		callback(null);
	}
};