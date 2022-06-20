const Article = require('../models/articleModel');
const catchAsync = require('../utils/catchAsync');

exports.createArticle = catchAsync(async (req, res, next) => {
  const newArticle = await Article.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      article: newArticle,
    },
  });
});
