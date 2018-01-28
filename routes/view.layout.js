
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const blocks  = require('./view.blocks');

const Group = mongoose.model('Group');

// ------------------------------------------------------------------
// Main Layout

router.get('/*', function(req, res, next) {

	// IF THE REQ.URL NOT FOUND INTO POST ROUTES
	// >> RENDER ERROR.PUG

	let found = false;
	blocks.stack.forEach(function(r) {
		if (r.route.methods.post && r.route.path) {
			if (r.route.path == req.originalUrl) {
				found = true;
			}
		}
	});

	if (!found) {
		return next({
			status: 404,
			message: '404: Not Found'
		});
	}

	// Select layout for different user groups 
	if (!req.user) return res.render('guest');

	Group.findById(req.user.group, function(err, group) {
		if (err) return next({message: err});

		if (group.name == 'member') return res.render('member', {user: req.user});
		if (group.name == 'admin') return res.render('admin', {user: req.user});
	
    });

});

// ------------------------------------------------------------------
// Export module
module.exports = router;