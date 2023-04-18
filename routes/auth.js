const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirm } = req.body;
    // /^[A-Za-z0-9]{3,}$/
    const regexResult = /^[A-Za-z0-9]{3,}$/.test(nickname);
    if (!regexResult) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    }
    if (password !== confirm) {
      return res.status(412).json({
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
    }
    if (password.length < 4) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    }
    if (password.includes(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }
    const isExistUser = await User.findOne({ nickname }).exec();
    if (isExistUser) {
      return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    }

    const user = new User({ nickname, password });
    await user.save();
    return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname }).exec();

  if (user === null || user.password !== password) {
    return res
      .status(412)
      .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
  }

  const token = jwt.sign({ nickname: user.nickname }, "awb231aswq211");
  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ Authorization: `Bearer ${token}` });
});

module.exports = router;
