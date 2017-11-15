// Dependencies
const mongoose = require('mongoose');
const async    = require('async');

// Models
const Test  = mongoose.model('Test');
const Topic = mongoose.model('Topic');
const Rule  = mongoose.model('Rule');
const User  = mongoose.model('User');

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