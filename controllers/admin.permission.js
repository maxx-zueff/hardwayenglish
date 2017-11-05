// Dependencies
const mongoose = require('mongoose');
const User = mongoose.model('User');

// ------------------------------------------------------------------

module.exports = function(req, res, next){

	User.findById(req.user._id).populate('group')
	.exec(function (err, user) {
		if (err) return res.send(err);
		if (user.group.name !== "admin") return res.send('No Permission');

		next();
	});
};
