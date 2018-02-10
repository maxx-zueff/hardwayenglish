// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const topic   = require('../controllers/topic');
const router  = express.Router();

const Group = mongoose.model('Group');

// ------------------------------------------------------------------
// Middleware

let get_group = function (req, res, next) {

	console.log('middleware start');

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

router.post('/a', function(req, res) {
	res.send('AAAAA');
});

router.post('/', get_group, function(req, res, next) {

	if (req.group == 'member' || req.group == 'admin') return next();
	return res.render('blocks/intro');

}, topic.get, function(req, res) {

	if (req.group == 'admin') {
		return res.render('blocks/admin/collections', {topics: req.topics});
	}

	if (req.group == 'member') {
		return res.render('blocks/collections', {topics: req.topics});
	}
});

// ------------------------------------------------------------------

// Export module
module.exports = router;