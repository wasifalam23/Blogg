const Comment = require('../models/commentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
  const newComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
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
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError('No Comment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
