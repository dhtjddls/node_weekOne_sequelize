const Joi = require("joi");

module.exports = {
  signupSchema: Joi.object({
    nickname: Joi.string()
      .regex(/^[A-Za-z0-9]{3,}$/)
      .messages({
        "string.base": "닉네임의 형식이 일치하지 않습니다.",
        "string.pattern.base": "닉네임의 형식이 일치하지 않습니다.",
        "string.empty": "닉네임의 형식이 일치하지 않습니다.",
        "string.min": "닉네임의 형식이 일치하지 않습니다.",
      }),
    password: Joi.string().min(4).required().messages({
      "string.base": "패스워드 형식이 일치하지 않습니다.",
      "string.empty": "패스워드 형식이 일치하지 않습니다.",
      "string.min": "패스워드 형식이 일치하지 않습니다.",
    }),
    confirm: Joi.string().valid(Joi.ref("password")).required().messages({
      "string.base": "패스워드가 일치하지 않습니다.",
      "any.only": "패스워드가 일치하지 않습니다.",
      "string.empty": "패스워드가 일치하지 않습니다.",
    }),
  })
    .custom((value, helper) => {
      if (value.password.toLowerCase().includes(value.nickname.toLowerCase())) {
        return helper.error("custom.passwordContainsNickname");
      }
      return value;
    })
    .message({
      "custom.passwordContainsNickname":
        "패스워드에 닉네임이 포함되어 있습니다.",
    }),
  loginSchema: Joi.object({
    nickname: Joi.string().required().messages({
      "string.base": "닉네임 또는 패스워드를 확인해주세요.",
      "string.empty": "닉네임 또는 패스워드를 확인해주세요.",
    }),
    password: Joi.string().required().messages({
      "string.base": "닉네임 또는 패스워드를 확인해주세요.",
      "string.empty": "닉네임 또는 패스워드를 확인해주세요.",
    }),
  }),
};
