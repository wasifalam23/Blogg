const Article = require('../models/articleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const checkPermission = catchAsync(async (loggedInUserId, articleId, next) => {
  const article = await Article.findById(articleId);

  if (!article) {
    return next(new AppError('No Article found with that ID', 404));
  }

  if (loggedInUserId !== article.author.id) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  return article;
});

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

exports.getMyArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ author: req.user.id });

  console.log(articles);

  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: {
      articles,
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
  const article = await checkPermission(req.user.id, req.params.id, next);

  const updatedArticle = await Article.findByIdAndUpdate(article.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      article: updatedArticle,
    },
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await checkPermission(req.user.id, req.params.id, next);

  await article.delete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
