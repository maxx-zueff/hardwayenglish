// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

// Models
const Topic = mongoose.model('Topic');
const Rule  = mongoose.model('Rule');
const User  = mongoose.model('User');

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

				if (err) return callback(err, null);
				if (rule == null) new_rule.order = 1;
				else new_rule.order = rule.order + 1;

				callback(null, new_rule);
			});
		},

		// Check name of rule and save it
		function(rule, callback) {

			Topic.findOne({name: req.body.topic}).populate('rule')
			.exec(function(err, topic) {

				if (err) return callback(err, null);
				let taken = false;

				// List rules inside topic
				topic.rule.forEach(function(item) {
					if (item.name == req.body.name) {
						taken = true;

						// Calling the callback function doesn't
						// break the execution
						return callback('Taken name', null);
					}
				});
				
				if (!taken) {
					rule.save(function(err, rule) {
						if (err) return callback(err, null);
						callback(null, rule);
					});
				}
			});
		}

	// Update topic
	], function(err, rule) {

		if (err) return res.json({error:err});

		Topic.findOneAndUpdate(

			{name: req.body.topic},
			{ $addToSet: { rule: rule._id } },

			function(err, topic) {
				if (err) return res.json({error:err});

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

			Topic.findOne({name: req.body.topic}).populate('rule')
			.exec(function(err, topic) {

				if (err) return callback(err, null);
				let found = false;

				topic.rule.forEach(function(rule) {
					if (rule.name == req.body.name) {
						found = true;
						return callback(null, rule, topic);
					}
				});

				if (!found) callback('Not Found!', null);

			});
		}

	// Find and update rule
	], function(err, rule, topic) {

		if (err) return res.json({error:err});

		let body = req.body;
		let update = {};

		// Set flex params
		for (var par in body) {

			if (par == 'name'
			   || par == 'content'
			   || par == 'example'
			   || par == 'order') {

				update[par] = body[par];
			}
		}

		Rule.findOneAndUpdate(
			
			{ _id: rule._id },
			{ $set: update },
			{ new: true },

			function(err, rule) {
				if (err) return res.json({error:err});
				if (rule == null) if (err) return res.json({
					error : 'Not Found!'
				});

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

	function remove(rule) {
		async.parallel([

			// REMOVE ALL LINKS
			function(callback) {
				Topic.findOneAndUpdate(

					{ name: req.body.topic },
					{ $pull: {rule:rule._id} }

				).exec(function(err, topic) {
					if (err) return callback(err, null);
					callback(null);
				});
			},

			// REMOVE ITSELF
			function(callback){
				Rule.findOneAndRemove({_id:rule._id})
				.exec(function(err, rule) {
					if (err) return callback(err, null);
					callback(null);
				});
			}

		// Send responce 	
		], function(err, result) {
			if (err) return res.json({error: err });
			res.json({ status: true });
		});
	}

	// Find rule ID
	Topic.findOne({name: req.body.topic}).populate('rule')
	.exec(function(err, topic) {

		if (err) return res.json({error:err});
		let found = false;

		topic.rule.forEach(function(rule) {
			if (rule.name == req.body.name) {
				found = true;
				return remove(rule);
			}
		});

		if (!found) res.json({error:'Not Found!'});
	});

};

// ------------------------------------------------------------------

module.exports.get = function(req, res) {

	async.waterfall([

		// Check allowed topic and get stage
		function(callback) {

			User.findById(req.user._id)
			.populate('topic.name').populate('topic.stage')
			.exec(function(err, user) {
				
				if (err) return callback(err, null);
				let allowed = false;

				user.topic.forEach(function(topic_group) {
					topic_group.name.forEach(function(topic) {

						if (req.body.topic == topic.name) {
							allowed = true;		
							
							return callback(null, 
								topic_group.stage.stage,
								topic_group.stage.mistake
							);
						}
					});
				});

				if (!allowed) callback('Topic not allowed!', null);

			});
		}

	// Get rule list
	], function(err, stage, mistake) {

		if (err) return res.json({error: err });

		let rules = {
			stage: stage,
			mistake: mistake,
			list: []
		};

		Topic.findOne({name:req.body.topic}).populate('rule')
		.exec(function(err, topic) {

			if (err) return res.json({error: err});			

			topic.rule.forEach(function(rule) {
				rules.list.push({
					name: rule.name,
					order: rule.order,
					content: rule.content,
					example: rule.example,
					topic: topic.name
				});
			});

			res.json(rules);

		});
	});
};
