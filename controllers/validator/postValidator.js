const Joi = require("joi");

module.exports = {
  postSchema: Joi.object({
    title: Joi.string().required().messages({
      "string.base": "게시글 제목의 형식이 일치하지 않습니다.",
      "string.empty": "게시글 제목을 입력해주세요.",
    }),
    content: Joi.string().required().messages({
      "string.base": "게시글 내용의 형식이 일치하지 않습니다.",
      "string.empty": "게시글 내용을 입력해주세요.",
    }),
  }),
};
