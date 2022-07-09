const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment field must not be empty!'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'A comment must belong to an article.'],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A comment must belong to an user.'],
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: '-email -__v -article ' });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
