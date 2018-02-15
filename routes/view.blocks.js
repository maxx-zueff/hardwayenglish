// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const topic   = require('../controllers/topic');
const rule    = require('../controllers/rule');
const router  = express.Router();

const Group = mongoose.model('Group');

// ------------------------------------------------------------------
// Middleware

let get_group = function (req, res, next) {

	if (!req.user) next();

	Group.findById(req.user.group, function(err, group) {
		console.log('search ready!');

		if (group.name == 'member') req.group = 'member';
		if (group.name == 'admin') req.group = 'admin';

		next();
	});
};

// ------------------------------------------------------------------
// Blocks

router.post('/', function(req, res) {
	return res.render('blocks/intro');
});

router.post('/collections', get_group, topic.get, function(req, res) {

	if (req.group == 'admin') {
		return res.render('blocks/admin/collections', {topics: req.topics});
	}

	if (req.group == 'member') {
		return res.render('blocks/collections', {topics: req.topics});
	}
});

router.post('/collections/*', rule.get, function(req, res, next) {

	// Search in DB
	// Check allowed for user

});

// ------------------------------------------------------------------
// Export module

module.exports = router;
