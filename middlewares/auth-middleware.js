const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (authType !== "Bearer" || !authToken) {
    return res.status(403).json({
      errorMessage: "로그인이 필요한 기능입니다.",
    });
  }

  try {
    const { nickname } = jwt.verify(authToken, "awb231aswq211");
    const user = await User.findOne({ nickname });
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};
