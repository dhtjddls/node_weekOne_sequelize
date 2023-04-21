const express = require("express");
const router = express.Router();
const { Comment, Posts, Like } = require("../models/index");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");
const { tryCatch } = require("../utils/tryCatch");

router.put(
  "/posts/:postId/like",
  authMiddleware,
  tryCatch(async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
  })
);

module.exports = router;
