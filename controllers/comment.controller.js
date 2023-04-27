const { tryCatch } = require("../utils/tryCatch");
const CommentService = require("../services/comments.service");
const PostService = require("../services/posts.service");
const { commentSchema } = require("../controllers/validator/commentValidator");
class CommentController {
  commentService = new CommentService();
  postService = new PostService();

  createComment = tryCatch(async (req, res) => {
    const { postId } = req.params;
    const { comment } = await commentSchema
      .validateAsync(req.body)
      .catch((err) => {
        return res.status(412).json({ errorMessage: err.message });
      });
    const { nickname, userId } = res.locals.user;

    const isExistPost = await this.postService.findOnePost(postId);
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }

    const createCommentData = await this.commentService.createComment(
      userId,
      postId,
      nickname,
      comment
    );
    console.log(createCommentData);
    res.status(201).json(createCommentData);
  });

  findAllComment = tryCatch(async (req, res) => {
    const { postId } = req.params;
    const isExistPost = await this.postService.findOnePost(postId);
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    const findAllCommentData = await this.commentService.findAllComment(postId);

    res.status(200).json({ comments: findAllCommentData });
  });

  putComment = tryCatch(async (req, res) => {
    const { postId, commentId } = req.params;
    const { comment } = await commentSchema
      .validateAsync(req.body)
      .catch((err) => {
        return res.status(412).json({ errorMessage: err.message });
      });
    const { userId } = res.locals.user;

    const isExistPost = await this.postService.findOnePost(postId);

    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }

    if (isExistPost.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }

    const isExistComment = await this.commentService.findOneComment(commentId);
    if (!isExistComment) {
      return res
        .status(404)
        .json({ errorMessage: "댓글이 존재하지 않습니다." });
    }

    const putCommentData = await this.commentService
      .putComment(postId, commentId, comment, userId)
      .catch((err) => {
        res
          .status(400)
          .json({ errorMessage: "댓글이 정상적으로 수정되지 않았습니다." });
      });

    res.status(200).json(putCommentData);
  });

  deleteComment = tryCatch(async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals.user;

    if (
      Object.keys(req.body).length === 0 ||
      Object.values(req.params).length === 0
    ) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const isExistPost = await this.postService.findOnePost(postId);
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }

    if (isExistPost.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "댓글 삭제의 권한이 존재하지 않습니다." });
    }

    const isExistComment = await this.commentService.findOneComment(commentId);

    if (!isExistComment) {
      return res
        .status(404)
        .json({ errorMessage: "댓글이 존재하지 않습니다." });
    }

    const deleteCommentData = await this.commentService
      .deleteComment(postId, commentId, userId)
      .catch((err) =>
        res
          .status(400)
          .json({ errorMessage: "댓글 삭제가 정상적으로 처리되지 않았습니다." })
      );

    return res.status(200).json(deleteCommentData);
  });
}
module.exports = CommentController;
