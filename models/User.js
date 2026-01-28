const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,

  ideas: [
    {
      title: String,
      description: String,
      image: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

