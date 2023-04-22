const express = require("express");
const router = express.Router();
const { Posts } = require("../models/index");
const authMiddleware = require("../middlewares/auth-middleware");
const { tryCatch } = require("../utils/tryCatch");

router.get(
  "/",
  authMiddleware,
  tryCatch(async (req, res) => {
    console.log("like");
    const posts = await Posts.findAll({
      attributes: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "createdAt",
        "updatedAt",
        "likes",
      ],
      order: [["likes", "DESC"]],
    });
    const data = {
      posts: posts.map((a) => {
        return {
          postId: a.postId,
          userId: a.UserId,
          nickname: a.nickname,
          title: a.title,
          likes: a.likes,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      }),
    };
    res.status(200).json(data);
  })
);

module.exports = router;
