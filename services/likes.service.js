const LikeRepository = require("../repositories/likes.repository");
const { Like } = require("../models");

class LikeService {
  likeRepository = new LikeRepository(Like);

  findLiked = async (userId) => {
    const likedData = await this.likeRepository.findLiked(userId);
    const postIds = likedData.map((like) => {
      return like.dataValues.postId;
    });
    return postIds;
  };

  findLikeExist = async (postId, userId) => {
    const likeExistData = await this.likeRepository.findLikeExist(
      postId,
      userId
    );
    return likeExistData;
  };

  createLike = async (postId, userId) => {
    const createLikeData = await this.likeRepository.createLike(postId, userId);
    return { message: "게시글의 좋아요를 등록하였습니다." };
  };

  deleteLike = async (postId, userId) => {
    const deleteLikeData = await this.likeRepository.deleteLike(postId, userId);
    return { message: "게시글의 좋아요를 취소하였습니다." };
  };
}

module.exports = LikeService;
