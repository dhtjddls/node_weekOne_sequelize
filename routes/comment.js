const express = require("express");
const router = express.Router();
const { Comment, Posts } = require("../models/index");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");
const { tryCatch } = require("../utils/tryCatch");

router.post(
  "/:postId/comments",
  authMiddleware,
  tryCatch(async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const { nickname, userId } = res.locals.user;

    if (comment === "" || comment === undefined) {
      return res
        .status(412)
        .json({ errorMessage: "댓글 내용을 입력해주세요." });
    }

    const isExistPost = await Posts.findOne({ where: { postId: postId } });
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }

    if (Object.keys(req.body).length === 0) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    await Comment.create({
      UserId: userId,
      PostId: postId,
      nickName: nickname,
      comment: comment,
    });
    res.status(201).json({ message: "댓글 작성에 성공하였습니다." });
  })
);

router.get(
  "/:postId/comments",
  tryCatch(async (req, res) => {
    const { postId } = req.params;
    const isExistPost = await Posts.findOne({ where: { postId: postId } });
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    const comments = await Comment.findAll({
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

    const data = {
      comments: comments.map((a) => {
        return {
          commentId: a.commentId,
          userId: a.UserId,
          nickname: a.nickName,
          comment: a.comment,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      }),
    };
    res.status(200).json(data);
  })
);

router.put(
  "/:postId/comments/:commentId",
  authMiddleware,
  tryCatch(async (req, res) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user;

    if (
      Object.keys(req.body).length === 0 ||
      Object.values(req.params).length === 0
    ) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (comment === "" || comment === undefined) {
      return res
        .status(412)
        .json({ errorMessage: "댓글 내용을 입력해주세요." });
    }
    const isExistPost = await Posts.findOne({ where: { postId: postId } });
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }

    if (isExistPost.UserId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }

    const isExistComment = await Comment.findOne({
      where: { commentId: commentId },
    });
    if (!isExistComment) {
      return res
        .status(404)
        .json({ errorMessage: "댓글이 존재하지 않습니다." });
    }

    await Comment.update(
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
    ).catch((err) => {
      res
        .status(400)
        .json({ errorMessage: "댓글이 정상적으로 수정되지 않았습니다." });
    });
    res.status(200).json({ message: "게시글을 수정하였습니다." });
  })
);

router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  tryCatch(async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals.user;

    if (
      Object.keys(req.body).length === 0 ||
      Object.values(req.params).length === 0
    ) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const isExistPost = await Posts.findOne({ where: { postId: postId } });
    if (!isExistPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }

    if (isExistPost.UserId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "댓글 삭제의 권한이 존재하지 않습니다." });
    }

    const isExistComment = await Comment.findOne({
      where: { commentId: commentId },
    });
    if (!isExistComment) {
      return res
        .status(404)
        .json({ errorMessage: "댓글이 존재하지 않습니다." });
    }

    await Comment.destroy({
      where: {
        [Op.and]: [
          { postId: postId },
          { commentId: commentId },
          { UserId: userId },
        ],
      },
    }).catch((err) =>
      res
        .status(400)
        .json({ errorMessage: "댓글 삭제가 정상적으로 처리되지 않았습니다." })
    );
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  })
);

module.exports = router;
