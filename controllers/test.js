// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

// Models
const Test  = mongoose.model('Test');
const Topic = mongoose.model('Topic');
const Rule  = mongoose.model('Rule');
const User  = mongoose.model('User');
const Stage = mongoose.model('Stage');

// ------------------------------------------------------------------

module.exports.add = function(req, res) {

	async.waterfall([

		// Create new test
		function(callback) {

			let test = new Test({
				_id: new mongoose.Types.ObjectId(),
				question: req.body.question,
				example: req.body.example,
				correct: req.body.correct,
				wrong: req.body.wrong
			});

			if (req.body.example) test.example = req.body.example;

			Topic.findOne({name: req.body.topic})
			.populate('rule').populate('test')
			.exec(function(err, topic) {

				if (err) return callback(err, null);
				let taken = false;
				let rule;

				// Search rule inside topic
				topic.rule.forEach(function(item) {
					if (item.name == req.body.rule) {
						test.rule = item._id;
						rule = item;
						return;
					}
				});

				// Check name of tests inside topic
				topic.test.forEach(function(item) {
					if (item.question == test.question) {
						taken = true;
						return callback('Taken name', null);	
					}
				});
				
				if (!taken) {
					test.save(function(err, test) {
						if (err) return callback(err, null);
						callback(null, test, rule);
					});
				}
			});
		}

	// Update topic
	], function(err, test, rule) {

		if (err) return res.json({error:err});
		
		Topic.findOneAndUpdate(
			{name: req.body.topic},
			{ $addToSet: { test: test._id } },

			function(err, topic) {
				if (err) return res.json({error:err});
				res.json({ 
					question: test.question,
					example: test.example,
					correct: test.correct,
					wrong: test.wrong,
					topic: topic.name,
					rule: {
						name: rule.name,
						content: rule.content,
						example: rule.example
					}
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

			Topic.findOne({name: req.body.topic}).populate('test')
			.populate('rule').exec(function(err, topic) {

				if (err) return callback(err, null);
				let found = false;

				topic.test.forEach(function(test) {
					if (test.question == req.body.question) {
						found = true;
						return callback(null, test, topic);
					}
				});

				if (!found) callback('Not Found!', null);

			});
		}

	// Find and update test
	], function(err, test, topic) {

		if (err) return res.json({error:err});

		let update = {};
		for (var par in req.body) {

			if (par == 'question'
			   || par == 'example'
			   || par == 'correct'
			   || par == 'wrong'
			   || par == 'rule') {

				update[par] = req.body[par];
			}
		}

		if (req.body.rule) {

			let found = false;
			topic.rule.forEach(function(rule) {
				if (rule.name == req.body.rule) {
					found = true;
					update.rule = rule._id;
				}
			});

			if (!found) return res.json({error:'Rule Not Found!'});
		}

		Test.findOneAndUpdate(

			{ _id: test._id },
			{ $set: update },
			{ new: true }

		).populate('rule').exec(function(err, test) {
			if (err) return res.json({error:err});
			res.json({ 
				question: test.question,
				example: test.example,
				correct: test.correct,
				wrong: test.wrong,
				topic: topic.name,
				rule: {
					name: test.rule.name,
					content: test.rule.content,
					example: test.rule.example
				}
			});
		});
	});
};

// ------------------------------------------------------------------

module.exports.remove = function(req, res) {

	function remove(test) {
		async.parallel([

			// REMOVE ALL LINKS
			function(callback) {
				Topic.findOneAndUpdate(

					{ name: req.body.topic },
					{ $pull: {test:test._id} }

				).exec(function(err, topic) {
					if (err) return callback(err, null);
					callback(null);
				});
			},

			// REMOVE ITSELF
			function(callback){
				Test.findOneAndRemove({_id:test._id})
				.exec(function(err, test) {
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

	// Find test ID
	Topic.findOne({name: req.body.topic}).populate('test')
	.exec(function(err, topic) {
		if (err) return res.json({error:err});

		let found = false;
		topic.test.forEach(function(test) {
			if (test.question == req.body.name) {
				found = true;
				return remove(test);
			}
		});

		if (!found) res.json({error:'Not Found!'});
	});
};

// ------------------------------------------------------------------

module.exports.get = function(req, res) {

	async.parallel({

		// get stage [mistakes]
		permission: function(callback) {
			User.findById(req.user._id).populate('group')
			.populate('topic.name').populate('topic.stage')
			.exec(function(err, user) {
				
				if (err) return callback(err, null);
				let allowed = false;

				user.topic.forEach(function(topic_group) {
					topic_group.name.forEach(function(topic) {

						if (req.body.topic == topic.name) {
							allowed = true;	

							return callback(null,{
								stage:topic_group.stage.stage,
								mistake:topic_group.stage.mistake_test,
								group: user.group.name
							});
						}
					});
				});

				if (!allowed) callback('Topic not allowed!', null);

			});
		},

		// Get test list
		test: function(callback) {
			Topic.findOne({name:req.body.topic}).populate('test')
			.populate('test.rule').exec(function(err, topic) {

				if (err) return callback(err, null);

				let list = [];
				topic.test.forEach(function(test) {
					list.push({
						question: test.question,
						example: test.example,
						correct: test.correct,
						wrong: test.wrong,
						topic: topic.name,
						rule: null
					});

					if (test.rule != null) {
						list.rule.push({
							name: test.rule.name,
							content: test.rule.content,
							example: test.rule.example
						});
					}
				});

				return callback(null, list);

			});
		}

	}, function(err, result) {

		if (err) return res.json({error: err});

		let admin = result.test;
		let member = [];

		result.test.forEach(function(test) {
			if (test.rule) {
				member.push(test);
			}
		});

		let tests = {
			stage: result.permission.stage,
			mistake: result.permission.mistake,
			list: member
		};

		if (result.permission.group == "admin") {
			tests.list = admin;
			return res.json(tests);
		}

		res.json(tests);

	});
};

// ------------------------------------------------------------------

module.exports.check = function(req, res) {

	async.parallel({

		user_db: function(callback) {

			User.findById(req.user._id)
			.populate('topic.name').populate('topic.stage')
			.populate('waiter.topic').exec(function(err, user) {
				if (err) callback(err, null);

				let wait = true;
				user.waiter.forEach(function(waiter) {
					if (waiter.topic == req.body.topic) {
						if (Date.now() > waiter.end) {
							wait = false;
							return;			
						}
					}
				});

				if (user.waiter.length == 0) wait = false;
				if (wait) return callback('You should wait!', null);

				let found = false;
				user.topic.forEach(function(topic_group) {
					if (req.body.topic == topic_group.name.name) {
						found = true;
						callback(null, {
							topic: topic_group.name,
							complete: topic_group.complete,
							stage: topic_group.stage
						});
					}
				});

				if (!found) return callback('Topic not found!', null);
			});
		},

		user_client: function(callback) {

			let mistakes = 0;
			Topic.findOne({name:req.body.topic}).populate('test')
			.exec(function(err, topic) {
				if(err) callback('Topic not found!', null);
				topic.test.forEach(function(test) {
					let found = false;
					req.body.test.forEach(function(user_test) {
						if (test.question == user_test.question) {
							found = true;
							if (test.correct != user_test.answer) {
								mistakes = mistakes +1;
							}
						}
					});
					if (!found) callback(
						'You must send all questions!', null
					);
				});
				callback(null, {
					mistakes: mistakes,
					count: topic.test.length
				});
			});
		}

	}, function(err, result) {

		if (err) return res.json({error: err});

		let user = result.user_client;
		let user_db = result.user_db;
		let allowed_mistakes = user_db.stage.mistake_test * user.count;

		// Test was not passed
		if (user.mistakes > allowed_mistakes) {

			User.findOneAndUpdate({
				"_id": req.user._id,
				"topic.name": user_db.topic._id
			},{
				$set : { "topic.$.complete": true }
			}, function(err, user) {
				if (err) return res.json({error: err});
				return res.json({
					status : "You must repeat this test!"
				});
			});
		}

		// Test was passed 
		else if (user.mistakes <= allowed_mistakes) {
			
			let new_order = user_db.topic.order + 1;
			let user_stage = user_db.stage.stage;

			async.parallel({
				stages: function(callback) {
					Stage.find().exec(function(err, stages) {
						if (err) return callback(err, null);
						callback(null, stages);
					});
				},
				topic: function(callback) {
					Topic.findOne({
						order: new_order
					}, function(err, topic) {
						if (err) return callback(err, null);
						callback(null, topic);
					});
				}
			}, function(err, result) {

				if (err) return res.json({error: err});

				if (user_stage == null) return res.json({
					error: "This topic already passed!"
				});

				// Add new topic for user
				if (user.mistakes == 0 && !user_db.complete || user_stage == 3) {
					
					let first_stage
					result.stages.forEach(function(doc) {
						if (doc.stage == 1) {
							first_stage = doc;
							return;
						}
					});

					let exam = {
						topic: user_db.topic._id,
						start: Date.now()/1000,
						end: Date.now()/1000 + (60*60*24*5),
						complete: false
					};

					let new_topic = {
						name: result.topic._id,
						stage: first_stage._id,
						complete: false
					};

					async.series([

						// Update current topic
						function(callback) {
							User.findOneAndUpdate({
								"_id": req.user._id,
								"topic.name": user_db.topic._id
							},{
								$set : {
									"topic.$.complete": true,
									"topic.$.stage": null
								}
							}, function(err, user) {
								if (err) return callback(err, null);
								callback(null);
							});
						},

						// Set new topic
						function(callback) {
							User.findByIdAndUpdate(req.user._id, {
								$push : {
									topic: new_topic,
									exam: exam
								}
							}, function(err, user) {
								if (err) return callback(err, null);
								callback(null);
							});
						}

					], function(err, result) {

						if (err) return res.json({error: err});
						return res.json([{
							topic: user_db.topic.name,
							stage: 0,
							exam: exam.start
						},{
							topic: result.topic.name,
							stage: 1
						}]);
					});
				}

				// Add new stage for user
				async.series({

					// Change stage / add waiter 
					data: function(callback) {

						let new_stage;
						result.stages.forEach(function(doc) {
							if (doc.stage == user_stage +1) {
								new_stage = doc;
								return;
							}
						});
						
						let waiter = {
							topic: user_db.topic,
							end: Date.now() + (60*60*8)
						};

						User.findOneAndUpdate({
							"_id": req.user._id,
							"topic.name": user_db.topic._id
						},{
							$set : {
								"topic.$.complete": false,
								"topic.$.stage": new_stage._id
							},
							$push : {
								waiter: waiter
							}
						}, function(err, user) {
							if (err) return callback(err, null);
							callback(null, {
								stage: new_stage.stage,
								waiter: waiter.end
							});
						});
					}

				}, function(err, result) {

					if (err) return res.json({error: err});
					return res.json({
						topic: user_db.topic.name,
						stage: result.data.stage,
						waiter: result.data.waiter
					});
				});
			});
		}		
	});
};