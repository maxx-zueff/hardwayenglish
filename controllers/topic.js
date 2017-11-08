// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

const Topic = mongoose.model('Topic');

// ------------------------------------------------------------------

module.exports.add = function(req, res) {

	async.waterfall([

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
		if (err) return res.send(err);

		topic.save(function(err, topic){
			if (err) res.send(err);
			res.json({ 
				name : topic.name,
				order : topic.order
			});
		});
	});
};

// ------------------------------------------------------------------

module.exports.update = function(req, res) {
	
	Topic.findOneAndUpdate(
		
		{ name: req.body.old_name },
		{ $set: { name: req.body.new_name} },
		{ new: true },
		
		function(err, topic) {
			if (err) return res.send(err);
			res.json({ 
				name : topic.name,
				order : topic.order
			});
		}
	);
};

// ------------------------------------------------------------------

module.exports.remove = function(req, res) {
	
	Topic.findOneAndRemove({name: req.body.topic})
	.exec(function (err, topic) {
		if (err) return res.json({status: err });
		if (!topic) return res.json({ status: "No topics found" });
		
		res.json({ status: true });
	});
};