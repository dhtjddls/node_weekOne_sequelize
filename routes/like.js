const express = require("express");
const router = express.Router();
const { Posts, Like } = require("../models/index");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");
const { tryCatch } = require("../utils/tryCatch");

router.get(
  "/",
  authMiddleware,
  tryCatch(async (req, res) => {
    const { userId } = res.locals.user;
    const Liked = await Like.findAll({
      where: { userId: userId },
      attributes: ["postId"],
    });

    if (Liked.length < 0)
      throw new Error("404/아직 좋아요를 누른 게시글이 없습니다.");

    const postIds = Liked.map((like) => {
      return like.dataValues.postId;
    });
    const getPosts = await Posts.findAll({
      where: {
        postId: {
          [Op.in]: postIds,
        },
      },
    });

    const posts = getPosts.map((post) => ({
      postId: post.postId,
      userId: post.UserId,
      nickname: post.nickname,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post.like,
    }));

    return res.status(200).json({ posts });
  })
);

module.exports = router;
