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
					order : rule.order
				});
			}
		);
	});
};