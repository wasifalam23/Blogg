const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'An article must have a title'],
    },

    description: {
      type: String,
      required: [true, 'An article must have some description'],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An article must belong to an author.'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual Populate
articleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
});

articleSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: '-__v -email' }).populate({
    path: 'comments',
  });
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
