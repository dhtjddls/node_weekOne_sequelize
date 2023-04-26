const PostService = require("../services/posts.service");
const LikeService = require("../services/likes.service");
const { tryCatch } = require("../utils/tryCatch");
const { sequelize } = require("../models");
const { Transaction } = require("sequelize");

class PostsController {
  postService = new PostService();
  likeService = new LikeService();

  getPosts = tryCatch(async (req, res) => {
    const posts = await this.postService.findAllPost();

    res.status(200).json({ posts: posts });
  });

  getPost = tryCatch(async (req, res) => {
    const { postId } = req.params;
    console.log(postId);
    const post = await this.postService.findOnePost(postId);

    res.status(200).json({ post: post });
  });

  createPost = tryCatch(async (req, res) => {
    const { title, content } = req.body;
    const { nickname, userId } = res.locals.user;

    if (Object.keys(req.body).length === 0) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (title === "" || title === undefined) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (content === "" || content === undefined) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    // 서비스 계층에 구현된 createPost 로직을 실행합니다.
    const createPostData = await this.postService.createPost(
      nickname,
      userId,
      title,
      content
    );
    res.status(200).json(createPostData);
  });

  putPost = tryCatch(async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals.user;

    if (
      Object.keys(req.body).length === 0 ||
      Object.values(req.params).length === 0
    ) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (title === "" || title === undefined) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (content === "" || content === undefined) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    const post = await this.postService.findOnePost(postId);
    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }

    const putPostData = await this.postService
      .putPost(title, content, postId, userId)
      .catch((err) => {
        res
          .status(401)
          .json({ errorMessage: "게시글이 정상적으로 수정되지 않았습니다." });
      });

    res.status(200).json(putPostData);
  });

  deletePost = tryCatch(async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    console.log(postId);

    const isExistPost = await this.postService.findOnePost(postId);
    if (!isExistPost)
      return res
        .status(403)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    if (!userId || isExistPost.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }
    const deletePostData = await this.postService
      .deletePost(postId, userId)
      .catch((err) => {
        res
          .status(401)
          .json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
      });

    res.status(200).json(deletePostData);
  });

  putLike = tryCatch(async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const isExistPost = await this.postService.findOnePost(postId);
    if (!isExistPost)
      return res
        .status(403)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });

    const isLikeExist = await this.likeService.findLikeExist(postId, userId);
    await sequelize.transaction(
      { isolateLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        if (isLikeExist) {
          const deleteLike = await this.likeService.deleteLike(postId, userId);
          const postDecreaseLike = await this.postService.postDecreaseLike(
            postId,
            userId
          );

          res.status(200).json(deleteLike);
        } else {
          const createLike = await this.likeService.createLike(postId, userId);
          const postIncreaseLike = await this.postService.postIncreaseLike(
            postId,
            userId
          );

          res.status(200).json(createLike);
        }
      }
    );
  });
}

module.exports = PostsController;
