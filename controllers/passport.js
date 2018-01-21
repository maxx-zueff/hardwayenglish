const passport = require('passport');
const mongoose = require('mongoose');

const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('User');

passport.use('user-local', new LocalStrategy(

    {
        usernameField : 'username',
        passwordField : 'password'
    },

    function(username, password, done) {
        User.findOne({ name: username }, function (err, user) {
            
            if (err) {
                return done(err);
            }
            
            // Return if user not found in database
            if (user == null) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            
            // Return if password is wrong
            if (!user.valid_password(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));

// add other strategies for more authentication flexibility
passport.use('sponsor-local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password' // this is the virtual field on the model
    },
    function(username, password, done) {

        User.findOne({email: username}, function(err, user) {
            
            if (err) return done(err);

            if (user == null) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            if (!user.valid_password(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            return done(null, user);
        });
    }
));