const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = Schema({
	name: String,
	order: Number,
	rule: [{
		type: Schema.Types.ObjectId,
		ref: 'Rule'
	}]
});

module.exports = mongoose.model('Topic', topicSchema);