const { Op } = require("sequelize");

class CommentRepository {
  constructor(commentModel) {
    this.Comment = commentModel;
  }
  createComment = async (userId, postId, nickname, comment) => {
    // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    const createCommentData = await this.Comment.create({
      UserId: userId,
      PostId: postId,
      nickName: nickname,
      comment: comment,
    });

    return createCommentData;
  };

  findAllComment = async (postId) => {
    const findAllCommentData = await this.Comment.findAll({
      where: { PostId: postId },
      attributes: [
        "commentId",
        "UserId",
        "nickName",
        "comment",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    return findAllCommentData;
  };

  findOneComment = async (commentId) => {
    const findOneCommentData = await this.Comment.findOne({
      where: { commentId: commentId },
    });
    return findOneCommentData;
  };

  putComment = async (postId, commentId, comment, userId) => {
    const putCommentData = await this.Comment.update(
      { comment },
      {
        where: {
          [Op.and]: [
            { postId: postId },
            { commentId: commentId },
            { UserId: userId },
          ],
        },
      }
    );
    return putCommentData;
  };

  deleteComment = async (postId, commentId, userId) => {
    const deleteCommentData = await this.Comment.destroy({
      where: {
        [Op.and]: [
          { postId: postId },
          { commentId: commentId },
          { UserId: userId },
        ],
      },
    });
    return deleteCommentData;
  };
}

module.exports = CommentRepository;
