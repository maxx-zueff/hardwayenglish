
// Dependencies
const mongoose = require('mongoose');
const async    = require('async');
const passport = require('passport');

const User = mongoose.model('User');
const UserCollection = mongoose.model('UserCollection');

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

    if (!req.body.username || !req.body.password || !req.body.email) {
        return sendJSONresponse(res, 400, {
            "message": "All fields required",
            email: req.body.email,
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
            Topic.find({}, function(err, topic) {
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

        let timestamp = Math.floor(Date.now()/1000);
        let user = new User({
            name: req.body.username,
            email: req.body.email,
            group: result.group._id,
            topic: []
        });

        result.topic.forEach(function(topic) {
            if (topic.order == 1) {
                user.topic.push(new UserCollection({
                    name: topic._id,
                    stage: result.stage._id,
                    start: timestamp,
                    end: timestamp,
                    type: "wait"
                }));
            }
            else user.topic.push(new UserCollection({
                name: topic._id,
                type: "locked"
            }));
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

module.exports.signin = function(req, res, next) {

    let auth = passport.authenticate(['user-local', 'sponsor-local'],
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
                    message: info.message
                });
            }
        }
    );

    auth(req, res);
};

// ------------------------------------------------------------------

module.exports.available = function(req, res) {

    let query = req.body.username ? {"name":req.body.username}
              : req.body.email ? {"email":req.body.email} : null;

    console.log(query);
    console.log(req.body);

    User.findOne(query, function(err, user) {

        if (err) return next({
            status:401,
            message: err.message
        });

        if (user == null) return res.json({available: true});
        if (user) return res.json({available: false});
    });

};
