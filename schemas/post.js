const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  nickname: {
    type: String,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

postSchema.set("timestamps", { createdAt: true, updatedAt: true });

module.exports = mongoose.model("Post", postSchema);
