const passport = require('passport');
const mongoose = require('mongoose');

const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('User');

passport.use(new LocalStrategy(

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
            if (!user) {
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