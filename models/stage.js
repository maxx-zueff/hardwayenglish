
// Dependencies
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// ------------------------------------------------------------------

// Init Schema
const stageSchema = new Schema({
	stage: Number,
	mistake: Number
});

// ------------------------------------------------------------------

// Export models
module.exports = mongoose.model('Stage', stageSchema);