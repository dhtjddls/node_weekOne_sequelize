const LikeService = require("../services/likes.service");
const PostService = require("../services/posts.service");
const { tryCatch } = require("../utils/tryCatch");

class LikesController {
  likeService = new LikeService();
  postService = new PostService();

  findLikedPost = tryCatch(async (req, res) => {
    const { userId } = res.locals.user;

    const likedData = this.likeService.findLiked(userId);

    if (likedData.length < 0)
      res
        .status(404)
        .json({ errorMessage: "아직 좋아요를 누른 게시글이 없습니다." });

    const likedPostData = this.postService.findLikedPost(likedData);

    return res.status(200).json(likedPostData);
  });
}

module.exports = LikesController;
