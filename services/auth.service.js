const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const UserRepository = require("../repositories/user.repository");
const SECRET_KEY = "awb231aswq211";
class AuthService {
  userRepository = new UserRepository();

  signup = async (nickname, password, confirm) => {
    const salt = bcrypt.genSaltSync(12);
    password = await bcrypt.hash(password, salt);

    const signupData = this.userRepository.createUser(
      nickname,
      password,
      confirm
    );
    return { message: "회원 가입에 성공하였습니다." };
  };

  login = async (nickname) => {
    const accessToken = jwt.sign({ nickname: nickname }, SECRET_KEY, {
      expiresIn: "2h",
    });
    const accessObject = { type: "Bearer", token: accessToken };

    const filePath = path.join(process.cwd(), "utils", "refresh.json");
    const fileData = JSON.parse(fs.readFileSync(filePath));
    const refreshToken = jwt.sign({}, SECRET_KEY, { expiresIn: "7d" });
    fileData[refreshToken] = nickname;
    fs.writeFileSync(filePath, JSON.stringify(fileData));

    return { accessObject, refreshToken: refreshToken };
  };

  findOneUser = async (nickname) => {
    const findOneUserData = this.userRepository.findOneUser(nickname);

    return findOneUserData;
  };
}

module.exports = AuthService;
