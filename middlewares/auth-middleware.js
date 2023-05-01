const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const UserRepository = require("../repositories/user.repository");
const RedisRepository = require("../repositories/redis.repository");
const userRepository = new UserRepository(Users);
const redisRepo = new RedisRepository();
module.exports = async (req, res, next) => {
  const { Authorization, refresh } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (authType !== "Bearer" || !authToken) {
    return res.status(403).json({
      errorMessage: "로그인이 필요한 기능입니다.",
    });
  }
  if (!refresh) {
    return res.status(403).json({
      errorMessage: "로그인이 필요한 기능입니다.",
    });
  }

  try {
    const isAccessTokenValidate = validateAccessToken(authToken);
    const isRefreshTokenValidate = validateRefreshToken(refresh);

    if (!isRefreshTokenValidate) {
      redisRepo.deleteRefreshToken(refresh);
      return res.status(419).json({
        message: "Refresh Token이 만료되었습니다. 다시 로그인 해주세요",
      });
    }

    if (!isAccessTokenValidate) {
      const accessTokenNickname = redisRepo.getRefreshToken(refresh);
      if (!accessTokenNickname)
        return res.status(419).json({
          message:
            "Refresh Token의 정보가 서버에 존재하지 않습니다. 다시 로그인 해주세요.",
        });
      const accessToken = jwt.sign(
        { nickname: accessTokenNickname }, // JWT 데이터
        process.env.SECRET_KEY, // 비밀키
        { expiresIn: "2h" }
      );
      console.log("access 쿠키 재발급");
      res.cookie("Authorization", `Bearer ${accessToken}`);
      const { nickname } = jwt.verify(accessToken, process.env.SECRET_KEY);
      const user = await userRepository.findOneUser(nickname);
      res.locals.user = user;
    } else {
      const { nickname } = jwt.verify(authToken, process.env.SECRET_KEY);
      const user = await userRepository.findOneUser(nickname);

      res.locals.user = user;
    }
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }

  function validateAccessToken(accessToken) {
    try {
      jwt.verify(accessToken, process.env.SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }

  // Refresh Token을 검증합니다.
  function validateRefreshToken(refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }
};
