const express = require('express');
const articleController = require('../controllers/articleController');
const commentRoutes = require('../routes/commentRoutes');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:articleId/comments', commentRoutes);

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(authController.protect, articleController.createArticle);

router.get(
  '/getAllMyArticles',
  authController.protect,
  articleController.getMyArticles
);

router
  .route('/:id')
  .get(articleController.getArticle)
  .patch(authController.protect, articleController.updateArticle)
  .delete(authController.protect, articleController.deleteArticle);

module.exports = router;
