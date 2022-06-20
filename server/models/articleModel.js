const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An article must have a title'],
  },

  description: {
    type: String,
    required: [true, 'An article must have some description'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
