const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
	githubID: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		default: "",
	},
	role: {
		type: String,
		required: true,
		default: 'writer',
	},
	displayName: {
		type: String,
		default: "",
	},
	linkedIn: {
		type: String,
		default: "",
	},
	github: {
		type: String,
		default: "",
	},
	twitter: {
		type: String,
		default: "",
	},
	website: {
		type: String,
		default: "",
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model('User', userSchema);