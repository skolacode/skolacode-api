const mongoose = require('mongoose');

const { Schema } = mongoose;

const feedbackSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
	author: { 
		type: Schema.Types.ObjectId,
		ref: 'User',
		required:true,
	},
	article: {
		type: Schema.Types.ObjectId,
		ref: 'Article',
		required: true,
	},
	status: {
		type: String,
		default: 'approved',
	},
	reportCount: {
		type: Number,
		default: 0,
	}
}, {
	timestamps: true,
});

module.exports = mongoose.model('Feedback', feedbackSchema);