const { Like } = require("../models");
const { Op } = require("sequelize");

class LikeRepository {
  findLiked = async (userId) => {
    const likedData = await Like.findAll({
      where: { userId: userId },
      attributes: ["postId"],
    });
    return likedData;
  };

  findLikeExist = async (postId, userId) => {
    const likeExistData = await Like.findOne({
      where: {
        [Op.and]: [{ postId: postId }, { UserId: userId }],
      },
    });
    return likeExistData;
  };

  createLike = async (postId, userId) => {
    console.log(userId, postId);
    const createLikeData = await Like.create({
      PostId: postId,
      UserId: Number(userId),
    });
    return createLikeData;
  };

  deleteLike = async (postId, userId) => {
    const deleteLikeData = await Like.destroy({
      where: {
        [Op.and]: [{ PostId: postId }, { UserId: userId }],
      },
    });
    return deleteLikeData;
  };
}

module.exports = LikeRepository;
