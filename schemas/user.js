const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: {
    // nickname 필드
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // password 필드
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
