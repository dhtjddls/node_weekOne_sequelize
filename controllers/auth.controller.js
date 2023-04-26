const AuthService = require("../services/auth.service");
const PostService = require("../services/posts.service");
const bcrypt = require("bcryptjs");
const { tryCatch } = require("../utils/tryCatch");

class AuthController {
  authService = new AuthService();
  postService = new PostService();

  signup = tryCatch(async (req, res) => {
    const { nickname, password, confirm } = req.body;
    const regexResult = /^[A-Za-z0-9]{3,}$/.test(nickname);
    const passwordLength = 4;
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
    if (password.length < passwordLength) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    }
    if (password.includes(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }
    const isExistUser = await this.authService.findOneUser(nickname);
    if (isExistUser) {
      return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    }

    const signupData = await this.authService.signup(
      nickname,
      password,
      confirm
    );
    res.status(200).json(signupData);
  });

  login = tryCatch(async (req, res) => {
    const { nickname, password } = req.body;
    const user = await this.authService.findOneUser(nickname);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
    }
    const loginData = await this.authService.login(nickname);
    res.cookie(
      "Authorization",
      `${loginData.accessObject.type} ${loginData.accessObject.token}`
    );
    res.cookie("refresh", loginData.refreshToken);
    res.status(200).json({
      Authorization: `${loginData.accessObject.type} ${loginData.accessObject.token}`,
    });
  });
}

module.exports = AuthController;
