const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  return res.status(400).json({ errorMessage: "해당 작업에 실패하였습니다." });
};

module.exports = errorHandler;
