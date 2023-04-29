const AuthService = require("../services/auth.service");
const PostService = require("../services/posts.service");
const bcrypt = require("bcryptjs");
const { tryCatch } = require("../utils/tryCatch");
const {
  signupSchema,
  loginSchema,
} = require("../controllers/validator/authValidator");

class AuthController {
  authService = new AuthService();
  postService = new PostService();

  signup = tryCatch(async (req, res) => {
    const { nickname, password, confirm } = await signupSchema
      .validateAsync(req.body)
      .catch((err) => {
        return res.status(412).json({ errorMessage: err.message });
      });

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
    const { nickname, password } = await loginSchema
      .validateAsync(req.body)
      .catch((err) => {
        return res.status(412).json({ errorMessage: err.message });
      });
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
    res.locals.user = user.dataValues;
    res.cookie("refresh", loginData.refreshToken);
    res.status(200).json({
      Authorization: `${loginData.accessObject.type} ${loginData.accessObject.token}`,
    });
  });
}

module.exports = AuthController;
