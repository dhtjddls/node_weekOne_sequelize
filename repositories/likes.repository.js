const { Op } = require("sequelize");

class LikeRepository {
  constructor(likeModel) {
    this.Like = likeModel;
  }
  findLiked = async (userId) => {
    const likedData = await this.Like.findAll({
      where: { userId: userId },
      attributes: ["postId"],
    });
    return likedData;
  };

  findLikeExist = async (postId, userId) => {
    const likeExistData = await this.Like.findOne({
      where: {
        [Op.and]: [{ postId: postId }, { UserId: userId }],
      },
    });
    return likeExistData;
  };

  createLike = async (postId, userId) => {
    const createLikeData = await this.Like.create({
      PostId: postId,
      UserId: Number(userId),
    });
    return createLikeData;
  };

  deleteLike = async (postId, userId) => {
    const deleteLikeData = await this.Like.destroy({
      where: {
        [Op.and]: [{ PostId: postId }, { UserId: userId }],
      },
    });
    return deleteLikeData;
  };
}

module.exports = LikeRepository;
