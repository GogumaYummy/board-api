const Joi = require('joi');

exports.createCommentSchema = {
  body: Joi.object().keys({
    comment: Joi.string().required().label('댓글 작성에 실패하였습니다.'),
  }),
  params: Joi.object().keys({
    postId: Joi.number().min(1).integer().label('댓글 작성에 실패하였습니다.'),
  }),
};

exports.readCommentsSchema = {
  params: Joi.object().keys({
    postId: Joi.number().min(1).integer().label('댓글 조회에 실패하였습니다.'),
  }),
};

exports.updateCommentSchema = {
  body: Joi.object().keys({
    comment: Joi.string().required().label('댓글 수정에 실패하였습니다.'),
  }),
  params: Joi.object().keys({
    commentId: Joi.number()
      .min(1)
      .integer()
      .label('댓글 수정에 실패하였습니다.'),
  }),
};

exports.deleteCommentSchema = {
  params: Joi.object().keys({
    commentId: Joi.number()
      .min(1)
      .integer()
      .label('댓글 삭제에 실패하였습니다.'),
  }),
};
