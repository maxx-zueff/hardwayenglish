
// Dependencies
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// ------------------------------------------------------------------

// Init Schema
const groupSchema = new Schema({
	name: String
});

// ------------------------------------------------------------------

// Methods for main Schema
groupSchema.methods.new_user = function(){
	this.name = 'member';
};

// ------------------------------------------------------------------

// Export models
module.exports = mongoose.model('Group', groupSchema);