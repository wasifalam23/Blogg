const multer = require('multer');
const sharp = require('sharp');
const Article = require('../models/articleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadArticlePhoto = upload.single('image');

exports.resizeArticlePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `article-${
    req.method === 'PATCH' ? req.params.id : req.user.id
  }-${Date.now()}.jpeg`;

  req.file.path = `uploads/images/articles/${req.file.filename}`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(req.file.path);

  next();
});

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
  const image = req.file ? req.file.filename : undefined;

  const newArticle = await Article.create({
    title: req.body.title,
    description: req.body.description,
    image,
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

  const updatedArticle = await Article.findByIdAndUpdate(
    article.id,
    {
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
    },
    {
      new: true,
      runValidators: true,
    }
  );

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
