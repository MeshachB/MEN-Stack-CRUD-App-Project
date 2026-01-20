const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
});

module.exports = mongoose.model('Idea', ideaSchema);


