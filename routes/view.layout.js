
// Dependencies
const express = require('express');
const router  = express.Router();
const blocks  = require('./view.blocks');

// ------------------------------------------------------------------
// Main Layout

router.get('/*', function(req, res) {

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
		return res.render('error');
	}

	// Select layout for different user groups 
	if (!req.user) return res.render('guest');
	if (req.user.group.name == 'member') return res.render('member');
	if (req.user.group.name == 'admin') return res.render('admin');

});

// ------------------------------------------------------------------
// Export module
module.exports = router;