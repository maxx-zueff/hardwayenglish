// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

const Topic = mongoose.model('Topic');
const Rule = mongoose.model('Rule');

// ------------------------------------------------------------------

module.exports.add = function(req, res) {

	async.waterfall([

		// Create new rule
		function(callback) {
			
			let new_rule = new Rule({
				_id: new mongoose.Types.ObjectId(),
				name: req.body.name,
				content: req.body.content,
				example: req.body.example
			});

			Rule.findOne().sort('-order').exec(function(err, rule) {
				if (err) return res.send(err);
				if (rule == null) new_rule.order = 1;
				else new_rule.order = rule.order + 1;

			});

			Topic.findOne({name: req.body.topic})
			.exec(function(err, topic){

				if (err) return res.send(err);
				new_rule.topic = topic._id;

				callback(null, topic, new_rule);
			});

		},


		// Check name of rule
		function(topic, rule, callback){

			Rule.findOne(
				{name: rule.name, topic: topic._id},

				function(err, rule){
					
					if (rule !== null) {
						return res.send('Taken name in this topic');
					}

					if (rule == null) callback(null, rule);
				}
			);
		},

		// Save new rule
		function(rule, callback) {

			rule.save(function(err, rule){
				if (err) res.send(err);
				callback(null, rule);
			});
		}	

	// Update topic
	], function(err, rule){
		if (err) return res.send(err);

		Topic.findOneAndUpdate(

			{name: req.body.topic},
			{ $addToSet: { rule: rule._id } },

			function(err, topic) {
				if (err) return res.send(err);

				res.json({ 
					name: rule.name,
					content: rule.content,
					example: rule.example,
					order : rule.order,
					topic: topic.name
				});
			}
		);
	});
};

// ------------------------------------------------------------------

module.exports.update = function(req, res) {

	async.waterfall([

		// Find topic
		function(callback) {

			Topic.findOne({name: req.body.topic})
			.exec(function(err, topic) {

				if (err) return res.json({status: err });
				callback(null, topic);
			});
		},

		// Set flex params
		function(topic, callback) {

			let body = req.body;
			let update = {};

			for (var par in body) {

				if (par == 'name'
				   || par == 'content'
				   || par == 'example'
				   || par == 'order') {

					update[par] = body[par];
				}
			}

			callback(null, topic, update);

		}

	// Find and update rule
	], function(err, topic, update) {

		Rule.findOneAndUpdate(
			
			{ name: req.body.name, topic: topic._id },
			{ $set: update },
			{ new: true },

			function(err, rule) {
				if (err) return res.send(err);
				if (rule == null) return res.send('Not found!');

				res.json({ 
					name: rule.name,
					content: rule.content,
					example: rule.example,
					order : rule.order,
					topic: topic.name
				});
			}
		);
	});

};

// ------------------------------------------------------------------

module.exports.remove = function(req, res) {

	async.waterfall([

		// Find topic
		function(callback) {

			Topic.findOne({name: req.body.topic})
			.exec(function(err, topic) {

				if (err) return res.json({status: err });
				callback(null, topic);
			});
		}

	// Find and remove rule
	], function(err, topic) {

		if (err) return res.json({status: err });

		Rule.findOneAndRemove({name: req.body.name, topic: topic._id})
		.exec(function(err, rule) {
			
			if (err) return res.json({status: err });
			if (!topic) {
				return res.json({ status: "No topics found" });
			}
	
			res.json({ status: true });
		});
	});
};