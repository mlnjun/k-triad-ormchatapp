var jwt = require('jsonwebtoken');

exports.tokenAuthchecking = async (req, res, next) => {
  var resultMsg = {
    code: 200,
    data: '',
    msg: '',
  };

  // 토큰이 넘어오지 않은 오류
  if (req.headers.authorization == undefined) {
    resultMsg.code = 400;
    resultMsg.data = null;
    resultMsg.msg = '토큰이 존재하지 않습니다.';

    res.json(resultMsg);
  }

  try {
    let token = req.headers.authorization.split('Bearer ')[1];
    let tokenData = await jwt.verify(token, process.env.JWT_KEY);

    // 토큰의 데이터가 유효함 > 라우팅 메소드 계속 진행
    if (tokenData != null) {
      // 검증된 토큰 정보를 res.locals에 저장
      // res.locals = 요청~응답의 생명주기동안만 사용될 변수를 저장
      res.locals.tokenData = tokenData;
      next();
    }
  } catch (err) {
    // 토큰의 데이터가 유효하지 않음
    resultMsg.code = 400;
    resultMsg.data = null;
    resultMsg.msg = '토큰에 데이터가 존재하지 않습니다.';
    res.json(resultMsg);
  }
};
