const Comment = require('../models/commentModel');
const Article = require('../models/articleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const checkPermission = async (loggedInUserId, commentId, reqType, next) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError('No Comment found with that ID', 404));
  }

  if (reqType === 'DELETE') {
    const article = await Article.findById(comment.article);
    const authorId = article.author.id;

    if (loggedInUserId !== comment.user.id && loggedInUserId !== authorId) {
      return next(
        new AppError('You do not have permission to perform this action', 401)
      );
    }
  } else {
    if (loggedInUserId !== comment.user.id) {
      return next(
        new AppError('You do not have permission to perform this action', 401)
      );
    }
  }

  return comment;
};

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({
    comment: req.body.comment,
    article: req.body.article,
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await checkPermission(
    req.user.id,
    req.params.id,
    'UPDATE',
    next
  );

  const newComment = await Comment.findByIdAndUpdate(comment.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newComment) {
    return next(new AppError('No Comment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await checkPermission(
    req.user.id,
    req.params.id,
    'DELETE',
    next
  );

  await comment.delete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
