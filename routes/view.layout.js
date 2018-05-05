
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const blocks  = require('./view.blocks');

const Group = mongoose.model('Group');


// ------------------------------------------------------------------
// Middleware

let get_group = function (req, res, next) {

	if (!req.user) return next();

	Group.findById(req.user.group, function(err, group) {
		if (group.name == 'member') req.group = 'member';
		if (group.name == 'admin') req.group = 'admin';
		next();
	});
};


// ------------------------------------------------------------------
// Root

router.get('/', get_group, function(req, res, next) {

	console.log(req.group);
	console.log(req.user);

	if (!req.user) return res.render('guest');
	if (req.group) return res.redirect('/collections');

});

// ------------------------------------------------------------------
// Collections

router.get('/collections', get_group, function(req, res, next) {

	console.log(req.user);
	console.log(req.group);

	// if (!req.user) return res.render("guest");
	if (!req.user) return res.redirect('/');
	if (req.group == 'member') return res.render('member', {user: req.user});
	if (req.group == 'admin') return res.render('admin', {user: req.user});

});


// ------------------------------------------------------------------
// Rules

router.get('/collections/*', get_group, function(req, res, next) {
	if (!req.user) return res.redirect('/');
	if (req.group == 'member') return res.render('member', {user: req.user});
	if (req.group == 'admin') return res.render('admin', {user: req.user});
});

// ------------------------------------------------------------------
// Main Layout

router.get('/*', get_group, function(req, res, next) {

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

	if (!req.user) return res.redirect('/');
	if (req.group == 'member') return res.render('member', {user: req.user});
	if (req.group == 'admin') return res.render('admin', {user: req.user});

});


// ------------------------------------------------------------------
// Export module

module.exports = router;
