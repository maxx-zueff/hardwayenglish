// Dependencies
const express = require('express');
const mongoose = require('mongoose');
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

	if (req.group == 'member') {
		return res.render('blocks/collections');
	}


	if (req.group == 'admin') {
		return res.render('blocks/admin/collections');
	}

	return res.render('blocks/intro');
});

// ------------------------------------------------------------------

// Export module
module.exports = router;