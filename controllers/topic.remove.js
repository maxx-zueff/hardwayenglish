// Dependencies
const mongoose = require('mongoose');
// const async    = require('async');

const Topic = mongoose.model('Topic');
// ------------------------------------------------------------------

module.exports = function(req, res) {
	
	Topic.findOneAndRemove({name: req.body.topic}, function (err, topic) {
		if (err) return res.send(err);
		if (!topic) return res.send("No topics found\n");
		
		res.send(req.body.topic + " has removed\n");
	});

};
