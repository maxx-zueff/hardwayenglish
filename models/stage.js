
// Dependencies
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// ------------------------------------------------------------------

// Init Schema
const stageSchema = new Schema({
	stage: Number,
	mistake_type: Number,
	mistake_test: Number
});

// ------------------------------------------------------------------

// Export models
module.exports = mongoose.model('Stage', stageSchema);