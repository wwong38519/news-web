var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var secret = process.env.SECRET || 'SECRET';

var UserSchema = new mongoose.Schema({
	username: {type: String, lowercasse: true, unique: true},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	//pbkdf2Sync(password, salt, iterations, key length)
};

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
	var validDays = 60;
	var today = new Date();
	var expire = new Date(today);
	expire.setDate(today.getDate() + validDays);
	return jwt.sign({
		_id: this._id,
		username: this.username,
		expire: parseInt(expire.getTime() / 1000)
	}, secret);
};

mongoose.model('User', UserSchema);
