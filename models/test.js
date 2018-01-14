const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const testSchema = Schema({
	question: String,
	example: String,
	correct: String,
	wrong: [String],
	rule: {
		type: Schema.Types.ObjectId,
		ref: 'Rule'
	}
});

module.exports = mongoose.model('Test', testSchema);