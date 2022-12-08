const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError.js');
const { User } = require('../db/models');
const { jwtSecret, passwordSalt } = require('../config/vars');

exports.signup = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    const existUser = await User.findOne({ where: { nickname } });
    if (existUser) throw new ApiError(412, '중복된 닉네임입니다.');

    if (password.includes(nickname))
      throw new ApiError(412, '패스워드에 닉네임이 포함되어 있습니다.');

    const hashedPassword = await bcrypt.hash(password, passwordSalt);

    await User.create({ nickname, password: hashedPassword });

    res.status(201).json({ message: '회원 가입에 성공하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '요청한 데이터 형식이 올바르지 않습니다.';
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname } });

    if (!user) throw new ApiError(412, '닉네임 또는 패스워드를 확인해주세요.');

    const comparisonResult = await bcrypt.compare(password, user.password);

    if (!comparisonResult)
      throw new ApiError(412, '닉네임 또는 패스워드를 확인해주세요.');

    const token = jwt.sign({ userId: user.userId }, jwtSecret, {
      expiresIn: 60 * 60,
    });

    res.status(200).cookie('accessToken', token).json({ token });
  } catch (err) {
    if (!(err instanceof ApiError)) err.message = '로그인에 실패하였습니다.';
    next(err);
  }
};
