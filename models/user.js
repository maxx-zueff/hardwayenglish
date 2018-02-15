// Dependencies
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const Schema   = mongoose.Schema;

// ------------------------------------------------------------------

const trackerSchema = new Schema({
	rule: {
		type: Schema.Types.ObjectId,
		ref: 'Rule',
	},
	mistake: Number,
	stage: Number
});

const collectionSchema = new Schema({
	name: {
		type: Schema.Types.ObjectId,
		ref: 'Topic'
	},
	stage: {
		type: Schema.Types.ObjectId,
		ref: 'Stage'
	},
	start: Number, // timestamp,
	end: Number, // timestamp
	type: {
		type: String,
		enum: ['wait', 'exam', 'completed', 'locked']
	},
	link: String
});

// Init main Schema
const userSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	hash: String,
	group: {
		type: Schema.Types.ObjectId,
		ref: 'Group'
	},
	tracker: [trackerSchema],
	topic: [collectionSchema],
});

// ------------------------------------------------------------------
// Methods for main Schema

// Set & Valid password
userSchema.methods.set_password = function (password) {
    this.hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
userSchema.methods.valid_password = function (password) {
    return bcrypt.compareSync(password, this.hash);
};

// Generate JSON Web Token
userSchema.methods.generate_jwt = function () {
	var exp = Math.floor(Date.now() / 1000) + (60*60*24*3);
    return {
        token : jwt.sign({
			_id   : this._id,
			name  : this.name,
			group : this.group,
			exp   : exp
		}, 'LOVE'),
        timestamp: exp
    };
};

// ------------------------------------------------------------------
// Export models

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('UserCollection', collectionSchema);
module.exports = mongoose.model('UserTracker', trackerSchema);
