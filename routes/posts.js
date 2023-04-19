const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");
// 게시글 작성
router.post("/", authMiddleware, async (req, res) => {
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

  try {
    await Posts.create({
      UserId: userId,
      title,
      content,
      nickname,
    });
    res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 조회
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    const data = {
      posts: posts.map((a) => {
        return {
          postId: a.postId,
          userId: a.UserId,
          nickname: a.nickname,
          title: a.title,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      }),
    };
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 상세 조회
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;

  try {
    const post = await Posts.findOne({
      attributes: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "content",
        "createdAt",
        "updatedAt",
      ],
      where: { postId: _postId },
    });

    const data = {
      post: {
        postId: post.postId,
        userId: post.UserId,
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 수정
router.put("/:_postId", authMiddleware, async (req, res) => {
  const { _postId } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user;

  try {
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
    const post = await Posts.findOne({ where: { postId: _postId } });
    if (post.UserId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }
    console.log(_postId, userId);
    await Posts.update(
      { title, content },
      {
        where: {
          [Op.and]: [{ postId: _postId }, { UserId: userId }],
        },
      }
    ).catch((err) => {
      res
        .status(401)
        .json({ errorMessage: "게시글이 정상적으로 수정되지 않았습니다." });
    });
    res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });
  }
});

// 게시글 삭제
router.delete("/:_postId", authMiddleware, async (req, res) => {
  const { _postId } = req.params;
  const { userId } = res.locals.user;
  try {
    const post = await Posts.findOne({ where: { postId: _postId } });
    if (!post)
      return res
        .status(403)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    if (!userId || post.UserId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }
    await Posts.destroy({
      where: {
        [Op.and]: [{ postId: _postId }, { UserId: userId }],
      },
    }).catch((err) =>
      res
        .status(401)
        .json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." })
    );
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

module.exports = router;
