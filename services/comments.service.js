const { Comment } = require("../models");
const CommentRepository = require("../repositories/comment.repository");

class CommentService {
  commentRepository = new CommentRepository(Comment);

  createComment = async (userId, postId, nickname, comment) => {
    const createPostData = await this.commentRepository.createComment(
      userId,
      postId,
      nickname,
      comment
    );
    return { message: "댓글 작성에 성공하였습니다." };
  };

  findAllComment = async (postId) => {
    const findAllCommentData = await this.commentRepository.findAllComment(
      postId
    );

    return findAllCommentData.map((a) => {
      return {
        commentId: a.commentId,
        userId: a.UserId,
        nickname: a.nickName,
        comment: a.comment,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
  };

  findOneComment = async (commentId) => {
    const findOneCommentData = await this.commentRepository.findOneComment(
      commentId
    );

    return findOneCommentData;
  };

  putComment = async (postId, commentId, comment, userId) => {
    const putCommentData = await this.commentRepository.putComment(
      postId,
      commentId,
      comment,
      userId
    );
    return { message: "댓글을 수정하였습니다." };
  };

  deleteComment = async (postId, commentId, userId) => {
    const deleteCommentData = await this.commentRepository.deleteComment(
      postId,
      commentId,
      userId
    );
    return { message: "댓글을 삭제하였습니다." };
  };
}

module.exports = CommentService;
