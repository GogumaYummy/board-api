const Joi = require('joi');

exports.createPostSchema = {
  body: Joi.object()
    .keys({
      title: Joi.string()
        .required()
        .label('게시글 제목의 형식이 일치하지 않습니다.'),
      content: Joi.string()
        .required()
        .label('게시글 내용의 형식이 일치하지 않습니다.'),
    })
    .label('데이터 형식이 올바르지 않습니다.'),
};

exports.readPostSchema = {
  params: Joi.object().keys({
    postId: Joi.number()
      .min(1)
      .integer()
      .label('게시글 조회에 실패하였습니다.'),
  }),
};

exports.updatePostSchema = {
  body: Joi.object()
    .keys({
      title: Joi.string()
        .required()
        .label('게시글 제목의 형식이 일치하지 않습니다.'),
      content: Joi.string()
        .required()
        .label('게시글 내용의 형식이 일치하지 않습니다.'),
    })
    .label('데이터 형식이 올바르지 않습니다.'),
  params: Joi.object().keys({
    postId: Joi.number()
      .min(1)
      .integer()
      .label('게시글 수정에 실패하였습니다.'),
  }),
};

exports.deletePostSchema = {
  params: Joi.object().keys({
    postId: Joi.number()
      .min(1)
      .integer()
      .label('게시글 작성에 실패하였습니다.'),
  }),
};

exports.likePostSchema = {
  params: Joi.object().keys({
    postId: Joi.number()
      .min(1)
      .integer()
      .label('게시글 좋아요에 실패하였습니다.'),
  }),
};
