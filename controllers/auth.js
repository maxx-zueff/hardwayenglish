
// Dependencies
const mongoose = require('mongoose');
const async    = require('async');
const passport = require('passport');

const User = mongoose.model('User');
const Group = mongoose.model('Group');

// ------------------------------------------------------------------

let sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

// ------------------------------------------------------------------

module.exports.signup = function (req, res, next) {

    if (!req.body.username || !req.body.password) {
        return sendJSONresponse(res, 400, {
            "message": "All fields required",
            username : req.body.username,
            password : req.body.password
        });
    }

    async.waterfall([

        function(callback) {
            Group.findOne({"name":"member"}, function(err, group) {
                if (err) return handleError(err);
                callback(null, group);
            });
        },

        function(group, callback) {

            let user = new User({
                name: req.body.username,
                group: group._id
            });

            // Add the salt and the hash to the instance
            user.set_password(req.body.password);

            callback(null, user);
        }

    ], function (err, user) {
        
        if (err) console.log(err);

        // Save the instance as a record to the database
        user.save(function(err) {

            if (err) console.log(err);

            // Generate a JWT
            let token = user.generate_jwt();

            // Send the JWT inside the JSON response
            res.status(200);
            res.json(token);

        });
    });
};

// ------------------------------------------------------------------

module.exports.signin = function(req, res) {

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