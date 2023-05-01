const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository");
const RedisRepository = require("../repositories/redis.repository");
const { Users } = require("../models");

class AuthService {
  userRepository = new UserRepository(Users);
  redisRepository = new RedisRepository();
  signup = async (nickname, password, confirm) => {
    const salt = bcrypt.genSaltSync(12);
    password = await bcrypt.hash(password, salt);

    const signupData = await this.userRepository.createUser(
      nickname,
      password,
      confirm
    );
    return { message: "회원 가입에 성공하였습니다." };
  };

  login = async (nickname) => {
    const accessToken = jwt.sign(
      { nickname: nickname },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    const accessObject = { type: "Bearer", token: accessToken };

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    this.redisRepository.setRefreshToken(refreshToken, nickname);

    return { accessObject, refreshToken: refreshToken };
  };

  findOneUser = async (nickname) => {
    const findOneUserData = this.userRepository.findOneUser(nickname);

    return findOneUserData;
  };
}

module.exports = AuthService;
