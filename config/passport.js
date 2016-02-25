var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
	function(username, password, callback) {
		User.findOne({username: username}, function(err, user) {
			if (err) {return callback(err);}
			if (!user) {
				return callback(null, false, {message: 'Incorrect username.'});
			}
			if (!user.validPassword(password)) {
				return callback(null, false, {message: 'Incorrect password.'});
			}
			return callback(null, user);
		});
	}
));
