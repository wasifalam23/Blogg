const Article = require('../models/articleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();

  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: {
      articles,
    },
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new AppError('No Article found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      article,
    },
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  const newArticle = await Article.create({
    title: req.body.title,
    description: req.body.description,
    author: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      article: newArticle,
    },
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const newArticle = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newArticle) {
    return next(new AppError('No Article found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      article: newArticle,
    },
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const loggedInUserId = req.user.id;

  const article = await Article.findByIdAndDelete(req.params.id);

  console.log(loggedInUserId, article.author.id);

  if (!article) {
    return next(new AppError('No Article found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
