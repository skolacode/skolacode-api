const mongoose = require('mongoose');

const { Schema } = mongoose;


const userSchema = new Schema({
  githubID: {
    type: String,
    require: true,
  },
  email: String,
  role: {
    type: String,
    required: true,
    default: 'writer',
  },
  displayName: String,
  linkedIn: String,
  github: String,
  twitter: String,
  website: String,
});

module.exports = mongoose.model('User', userSchema);