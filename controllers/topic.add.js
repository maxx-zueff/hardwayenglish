// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

const User = mongoose.model('User');
const Topic = mongoose.model('Topic');

// ------------------------------------------------------------------

module.exports = function(req, res) {

	async.waterfall([

		// Check permission
		function(callback) {

			User.findById(req.user._id).populate('group')
			.exec(function (err, user) {
				if (err) res.send(err);
				if (user.group.name !== "admin") {
					res.send('No Permission');
				}

				callback(null);
			});
		},

		// Create new topic
		function(callback) {

			let new_topic = new Topic({
				name: req.body.topic
			});

			Topic.findOne().sort('-order').exec(function(err, topic){
				if (err) return res.send(err);
				if (topic == null) new_topic.order = 1;
				else new_topic.order = topic.order + 1;

				callback(null, new_topic);
			});
		}

	// Save new topic	
	], function (err, topic) {
		if (err) console.log(err);

		topic.save(function(err, topic){
			if (err) res.send(err);
			res.send(topic);
		});
	});
};
