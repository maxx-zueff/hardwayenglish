const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
	name: String,
	order: Number,
	content: String,
	example: [String],
	topic: {
		type: Schema.Types.ObjectId,
		ref: 'Topic'
	}
});

module.exports = mongoose.model('Rule', ruleSchema);