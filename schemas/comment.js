const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  nickname: {
    type: String,
  },
  comment: {
    type: String,
  },
});
commentSchema.set("timestamps", { createdAt: true, updatedAt: true });

module.exports = mongoose.model("Comment", commentSchema);
