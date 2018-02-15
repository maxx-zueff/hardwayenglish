// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

// Models
const Topic = mongoose.model('Topic');
const Rule  = mongoose.model('Rule');
const User  = mongoose.model('User');
const Test  = mongoose.model('Test');

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
						return callback({err:'Taken name'}, null);
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

		if (err) return next({
            message: err.err
        });

		Topic.findOneAndUpdate(

			{name: req.body.topic},
			{ $addToSet: { rule: rule._id } },

			function(err, topic) {
				if (err) return next({
		            message: err.err
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

				if (!found) callback({err:'Not Found!'}, null);

			});
		}

	// Find and update rule
	], function(err, rule, topic) {

		if (err) return next({
            message: err.err
        });

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
				if (err) return next({
		            message: err.err
		        });

				if (rule == null) if (err) next({
		            message: 'Not Found!'
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

			function(callback) {
				Test.findOneAndUpdate(

					{ rule: rule._id },
					{ $set: { rule: null } }

				).exec(function(err, test) {
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
			if (err) return next({
	            message: err.err
	        });
			res.json({ status: true });
		});
	}

	// Find rule ID
	Topic.findOne({name: req.body.topic}).populate('rule')
	.exec(function(err, topic) {

		if (err) return next({
            message: err.err
        });

		let found = false;
		topic.rule.forEach(function(rule) {
			if (rule.name == req.body.name) {
				found = true;
				return remove(rule);
			}
		});

		if (!found) next({
            message: 'Not Found!'
        });
	});

};

// ------------------------------------------------------------------

module.exports.get = function(req, res, next) {

	if (!req.body.topic) req.topic = req.params[0].replace( /-/g, " " );
	else req.topic = req.body.topic

	async.waterfall([

		// Check allowed topic and get stage
		function(callback) {

			User.findById(req.user._id)
				.populate('waiter.stage')
				.populate('waiter.topic')
				.populate('completed.topic')
				.populate('exam.topic')
			.exec(function(err, user) {

				if (err) return callback(err, null);
				let allowed = false;

				user.topic.forEach(function(topic_group) {
					topic_group.name.forEach(function(topic) {

						if (req.body.topic == topic.name) {
							allowed = true;

							return callback(null,
								topic_group.stage.stage,
								topic_group.stage.mistake_type
							);
						}
					});
				});

				if (!allowed) callback({err:'Topic not allowed!'}, null);

			});
		}

	// Get rule list
	], function(err, stage, mistake) {

		if (err) return next({
            message: err.err
        });

		let rules = {
			stage: stage,
			mistake: mistake,
			list: []
		};

		Topic.findOne({name:req.body.topic}).populate('rule')
		.exec(function(err, topic) {

			if (err) return next({
	            message: err.err
	        });

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

// ------------------------------------------------------------------

module.exports.stat = function(req, res) {

	async.parallel({

		rule : function(callback) {
			// Find rule
			Topic.findOne({name:req.body.topic}).populate('rule')
			.exec(function(err, topic) {

				if (err) return callback(err, null);

				let found = false;
				topic.rule.forEach(function(rule) {
					if (rule.name == req.body.rule) {
						found = true;
						return callback(null, rule);
					}
				});

				if (!found) callback({err: 'Rule not found!'}, null);
			});
		},

		user: function(callback) {

			User.findById(req.user._id).populate('topic.name')
			.populate('topic.stage').exec(function(err, user) {

				if (err) return callback(err, null);
				let allowed = false;

				user.topic.forEach(function(topic_group) {
					topic_group.name.forEach(function(topic) {

						// Find allowed topic
						if (req.body.topic == topic.name) {
							allowed = true;

							// Compare get mistakes between
							// allowed mistakes
							if (topic_group.stage.mistake_type
								>= req.body.mistakes) {

								return callback(null, {
									mistakes: req.body.mistakes,
									stage: topic_group.stage.stage
								});
							}

							else {
								return callback({err:'Many mistakes!'}, null);
							}
						}
					});
				});

				if (!allowed) callback({err:'Topic not allowed!'}, null);

			});
		}

	}, function(err, result) {

		if (err) return next({
            message: err.err
        });

		let new_track = {
			rule: result.rule._id,
			mistake: result.user.mistakes,
			stage: result.user.stage
		};

		async.series([

			function(callback) {

				// Checking existent tracks
				User.findById(req.user._id, function(err, user) {
					user.tracker.forEach(function(track) {

						if (track.rule == new_track.rule
							&& track.stage == new_track.stage) {

							return callback(
								{err: 'You passed this rule!'}, null
							);
						}
					});

					callback(null);
				});
			},

			function(callback) {

				User.findByIdAndUpdate(
					req.user._id,
					{$push : {tracker: new_track} },
					function(err, tracker) {
						if (err) return callback(err, null);
						callback(null);
					}
				);
			}

		], function(err, result) {
			if (err) return next({
	            message: err.err
	        });
			res.json({
				status: true
			});
		});

	});
};
