const Joi = require("joi");

module.exports = {
  commentSchema: Joi.object({
    comment: Joi.string().required().messages({
      "string.base": "데이터 형식이 올바르지 않습니다.",
      "string.empty": "댓글 내용을 입력해주세요.",
    }),
  }),
};
