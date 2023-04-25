const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = require("../controllers/comment.controller");
const commentController = new CommentController();

router.post(
  "/:postId/comments",
  authMiddleware,
  commentController.createComment
);
router.get("/:postId/comments", commentController.findAllComment);
router.put(
  "/:postId/comments/:commentId",
  authMiddleware,
  commentController.putComment
);
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
