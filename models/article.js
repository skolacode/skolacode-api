const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleSchema = new Schema({
	title: {
		type: String,
		require: true,
	},
	headerImgUrl: {
		type: String,
		require: true,
	},
	content: {
		type: String,
		required: true,
	},
	tags: [{
		type: String,
		default: [],
	}],
	popularity: {
		type: Number,
		default: 0,
	},
	isPublished: {
		type: Boolean,
		required: true,
		default: false,
	},
	status: {
		type: String,
		required: true,
		default: "reviewing",
	},
	author: { 
		type: Schema.Types.ObjectId,
		ref: 'User',
		required:true,
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model('Article', articleSchema);