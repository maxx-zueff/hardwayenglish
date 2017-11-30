
// Dependencies
const mongoose = require('mongoose');
const async    = require('async');
const passport = require('passport');

const User  = mongoose.model('User');
const Group = mongoose.model('Group');
const Topic = mongoose.model('Topic');
const Stage = mongoose.model('Stage');

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

    async.parallel({

        group : function(callback) {
            Group.findOne({"name":"member"}, function(err, group) {
                if (err) return callback(err, null);
                callback(null, group);
            });
        },

        topic : function(callback) {
            Topic.findOne({ order : 1 }, function(err, topic) {
                if (err) return callback(err, null);
                callback(null, topic);
            });
        },

        stage : function(callback) {
            Stage.findOne({ stage : 1 }, function(err, stage) {
                if (err) return callback(err, null);
                callback(null, stage);
            });
        }

    }, function(err, result) {
        if (err) return next({
            message: err.err
        });

        let user = new User({
            name: req.body.username,
            group: result.group._id,
            topic: [{
               name: [result.topic._id],
               stage: result.stage._id 
            }]
        });

        // Add the salt and the hash to the instance
        user.set_password(req.body.password);
        
        // Save the instance as a record to the database
        user.save(function(err) {

            if (err) return next({
                message: err.err
            });

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

    let auth = passport.authenticate('local', 
        function (err, user, info) {

            // If Passport throws/catches an error
            if (err) {
                return next({
                    status: 404,
                    message: err.message
                });
            }
            // If a user is found
            if (user) {
                var token = user.generate_jwt();
                res.status(200);
                res.json(token);
            }
            else {
                // If user is not found
                return next({
                    status: 401,
                    message: err.message
                });
            }
        }
    );

    auth(req, res);
};