
// Dependencies
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const Schema   = mongoose.Schema;


// ------------------------------------------------------------------

// Init embedded Schemas
const allowedSchema = new Schema({
	name: [{
		type: Schema.Types.ObjectId,
		ref: 'Topic'
	}],
	stage: {
		type: Schema.Types.ObjectId,
		ref: 'Stage'
	}
});

const trackerSchema = new Schema({
	rule: {
		type: Schema.Types.ObjectId,
		ref: 'Rule',
	},
	time: Number, // seconds
	mistake: Number,
	stage: Number
});

const waiterSchema = new Schema({
	rule: {
		type: Schema.Types.ObjectId,
		ref: 'Rule',
	},
	end: Number // timestamp
});

const examSchema = new Schema({
	topic: {
		type: Schema.Types.ObjectId,
		ref: 'Topic'
	},
	start: Number, // timestamp
	complete: Boolean
});

// Init main Schema
const userSchema = new Schema({
	name: { 
		type: String,
		unique: true,
		required: true
	},
	hash: String,
	group: {
		type: Schema.Types.ObjectId,
		ref: 'Group'
	},
	topic: [allowedSchema],
	tracker: [trackerSchema],
	waiter: [waiterSchema],
	exam: [examSchema]
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
	var exp = Math.floor(Date.now() / 1000) + (60*60*24*31);
    return {
        value : jwt.sign({
			_id   : this._id,
			name  : this.name,
			exp   : exp
		}, 'LOVE'),
        timestamp: exp
    };
};

// ------------------------------------------------------------------

// Export models
module.exports = mongoose.model('Tracker', trackerSchema);
module.exports = mongoose.model('Waiter', waiterSchema);
module.exports = mongoose.model('Exam', examSchema);
module.exports = mongoose.model('User', userSchema);