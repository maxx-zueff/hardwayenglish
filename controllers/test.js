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