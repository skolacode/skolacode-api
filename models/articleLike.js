const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleLikeSchema = new Schema({
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
}, {
	timestamps: true,
});

module.exports = mongoose.model('ArticleLike', articleLikeSchema);