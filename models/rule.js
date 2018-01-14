const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
	name: String,
	order: Number,
	content: String,
	example: [String]
});

module.exports = mongoose.model('Rule', ruleSchema);