const mongoose = require('mongoose');
const User = require('../models/userModel');

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

    photo: String,

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

// articleSchema.pre('save', async function (next) {
//   // const authorId = this.author;
//   // this.author = await User.findById(authorId);
//   // await this.save();
//   const author = await User.findById(this.author);
//   this.author = author;
//   console.log(this.author);
//   next();
// });

articleSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: '-__v -email' }).populate({
    path: 'comments',
    select: '-__v',
  });
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
