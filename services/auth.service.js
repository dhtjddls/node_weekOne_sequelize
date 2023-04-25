const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository");

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
    const token = jwt.sign({ nickname: nickname }, "awb231aswq211");
    return { type: "Bearer", token: token };
  };

  findOneUser = async (nickname) => {
    const findOneUserData = this.userRepository.findOneUser(nickname);

    return findOneUserData;
  };
}

module.exports = AuthService;
