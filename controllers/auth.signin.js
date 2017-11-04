
// Dependencies
const mongoose = require('mongoose');
const passport = require('passport');

const User     = mongoose.model('User');

// ------------------------------------------------------------------

module.exports = function(req, res) {

    let auth = passport.authenticate('local', function (err, user, info) {

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
        // If a user is found
        if (user) {
            var token = user.generate_jwt();
            res.status(200);
            res.json(token);
        }
        else {
            // If user is not found
            res.status(401).json(info);
        }
    });

    auth(req, res);
};