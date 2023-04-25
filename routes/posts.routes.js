const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const PostController = require("../controllers/posts.controller");
const postcontroller = new PostController();

router.post("/", authMiddleware, postcontroller.createPost);
router.get("/", postcontroller.getPosts);
router.get("/:postId", postcontroller.getPost);
router.put("/:postId", authMiddleware, postcontroller.putPost);
router.delete("/:postId", authMiddleware, postcontroller.deletePost);
router.put("/:postId/like", authMiddleware, postcontroller.putLike);

module.exports = router;
