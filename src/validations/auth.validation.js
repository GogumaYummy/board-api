const Joi = require('joi');

exports.signupSchema = {
  body: Joi.object().keys({
    nickname: Joi.string()
      .regex(new RegExp(/^[\da-zA-Z]{3,}$/))
      .required()
      .label('ID의 형식이 일치하지 않습니다.'),
    password: Joi.string()
      .min(4)
      .required()
      .label('패스워드 형식이 일치하지 않습니다.'),
    confirm: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('패스워드가 일치하지 않습니다.'),
  }),
};

exports.loginSchema = {
  body: Joi.object().keys({
    nickname: Joi.string()
      .required()
      .label('닉네임 또는 패스워드를 확인해주세요.'),
    password: Joi.string()
      .required()
      .label('닉네임 또는 패스워드를 확인해주세요.'),
  }),
};
