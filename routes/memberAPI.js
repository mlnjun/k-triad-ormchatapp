var express = require("express");
var router = express.Router();

var db = require("../models");

// jsonwebtoken패키지 참조
const jwt = require('jsonwebtoken'); 

// bcryptjs 패키지 참조
const bcrypt = require('bcryptjs');

//회원 정보 관리 RESTful API 라우팅 기능 제공
// http://localhost:3000/api/member

router.post("/login", async function (req, res, next) {
  var apiResult = {
    code: 200,
    data: null,
    result: "",
  };

  try {
    // step1: 사용자 로그인 정보 추출하기
    const { email, member_password } = req.body;

    // step2: DB members테이블에서 동일한 메일주소의 단일 사용자 정보 조회
    const member = await db.Member.findOne({ where: { email } });

    // step3: 로그인 처리 로직 구현
    var resultMsg = "";

    if (member == null) {
      resultMsg = "동일한 메일주소가 존재하지 않습니다.";
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.result = resultMsg;
    } else {
      // DB서버에 저장되어 조회된 암호값과 사용자가 입력한 암호값이 일치하면
      if (member.member_password == member_password) {
        resultMsg = "로그인 성공";
        apiResult.code = 200;
        apiResult.data = member;
        apiResult.result = resultMsg;
      } else {
        resultMsg = "암호가 일치하지 않습니다.";
        apiResult.code = 400;
        apiResult.data = null;
        apiResult.result = resultMsg;
      }
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "서버에러발생 관리자에게 문의하세요.";
  }

  res.json(apiResult);
});

router.post("/entry", async function (req, res, next) {
  var apiResult = {
    code: 200,
    data: null,
    result: "",
  };

  try {
    const { name, member_password, telephone, email, birth_date } = req.body;

    let birthDateStr = birth_date.split("-").join("").substr(2);

    const newMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path:
        "https://www.interpark.com/images/header/nav/icon_special.png",
      entry_type_code: 1,
      use_state_code: 1,
      birth_date: birthDateStr,
      reg_date: Date.now(),
      reg_member_id: 2,
    };

    const member = await db.Member.create(newMember);

    apiResult.code = 200;
    apiResult.data = member;
    apiResult.result = "ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "서버에러발생 관리자에게 문의하세요.";
  }

  res.json(apiResult);
});

router.post("/find", async (req, res) => {
  var apiResult = {
    code: 200,
    data: null,
    result: "",
  };

  try {
    const email = req.body.email;

    const member = await db.Member.findOne({ where: { email } });

    var resultMsg = "";

    if (member == null) {
      resultMsg = "동일한 메일주소가 존재하지 않습니다.";
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.result = resultMsg;
    } else {
      resultMsg = "암호 찾기 완료.";
      apiResult.code = 200;
      apiResult.data = member.member_password;
      apiResult.result = resultMsg;
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "서버에러발생 관리자에게 문의하세요.";
  }
  res.json(apiResult);
});

// http://localhost:3000/api/member/all
// 전체 회원목록 데이터 조회 GET 요청 - 전체 회원 목록 데이터 응답
router.get("/all", async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: "ok",
  };

  try {
    const memberList = await db.Member.findAll();

    apiResult.code = 200;
    apiResult.data = memberList;
    apiResult.result = "ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }
  res.json(apiResult);
});

// 계정 생성
// http://localhost:3000/api/member/create
router.post("/create", async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: null,
    result: "",
  };

  try {
    const { name, member_password, telephone, email, birth_date } = req.body;

    let birthDateStr = birth_date.split("-").join("").substr(2);

    const newMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path:
        "https://www.interpark.com/images/header/nav/icon_special.png",
      entry_type_code: 1,
      use_state_code: 1,
      birth_date: birthDateStr,
      reg_date: Date.now(),
      reg_member_id: 2,
    };

    const member = await db.Member.create(newMember);

    apiResult.code = 200;
    apiResult.data = member;
    apiResult.result = "ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "서버에러발생 관리자에게 문의하세요.";
  }

  res.json(apiResult);
});

// 계정 정보 수정
// http://localhost:3000/api/member/modify/1
router.post("/modify/:mid", async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: "ok",
  };

  try {
    const member_id = req.params.mid;

    const { name, member_password, telephone, email, birth_date } = req.body;

    let birthDateStr = birth_date.split("-").join("").substr(2);

    const editedMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path:
        "https://www.interpark.com/images/header/nav/icon_special.png",
      entry_type_code: 1,
      use_state_code: 1,
      birth_date: birthDateStr,
      edit_date: Date.now(),
      reg_member_id: 2,
    };

    const updatedCount = await db.Member.update(editedMember, {
      where: member_id,
    });

    apiResult.code = 200;
    apiResult.data = updatedCount;
    apiResult.result = "ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

// 계정 삭제
// http://localhost:3000/api/member/delete
router.post("/delete", async (req, res) => {
  const apiResult = {
    code: 200,
    data: [],
    result: "ok",
  };

  try {
    const member_id = req.query.aid;

    var deletedCnt = await db.Member.destroy({ where: { member_id } });

    apiResult.code = 200;
    apiResult.data = deletedCnt;
    apiResult.result = "ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

// 단일 회원정보 데이터 조회
// http://localhost:3000/api/member/mid

router.get("/:mid", async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: "ok",
  };

  try {
    const memberId = req.params.mid;

    const member = await db.Member.findOne({ where: { memberId } });

    apiResult.code = 200;
    apiResult.data = member;
    apiResult.result = "ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});


// 사용자 암호 체크 및 암호 변경 기능
// http://localhost:3000/api/member/password/update
// POST
router.post("/password/update", async(res, req, next)=>{
  var resultMsg = {
    code:200,
    data:"",
    msg:""
  }

try{
    // 사용자 암호 받기
    var password = req.body.password;
    var newPassword = req.body.newPassword;

    // 토큰으로 사용자 정보 받기
    var token = req.headers.authorization.split('Bearer ')[1];
    var tokenData = await jwt.verify(token, process.env.JWT_KEY);
    
    
    if(tokenData == null){
      resultMsg.code = 400;
      resultMsg.data = null;
      resultMsg.msg = "해당 토큰의 회원은 존재하지 않습니다.";
    }

    var tokenMemberId = tokenData.member_id;


    // 토큰으로 받은 사용자 DB에서 찾기
    var userMember = await db.Member.findOne({ where : { member_id : tokenMemberId } });

    var PWCompare = await bcrypt.compare(password, userMember.member_password);

    // 암호 틀린 오류
    if(!PWCompare){
      resultMsg.code = 400;
      resultMsg.data = null;
      resultMsg.msg = "암호가 틀렸습니다.";
    }else{  // 유저 입력 암호 일치 > 암호 변경
      // 입력받은 새 암호 암호화
      var encryptNewPW = await bcrypt.hash(newPassword, 12);

      // 암호화된 새 암호 DB등록
      userMember.member_password = encryptNewPW;
      var updatedMember = await db.Member.update(userMember, { where:{ memberId:tokenMemberId } });

      // 결과
      resultMsg.code = 200;
      resultMsg.data = updatedMember;
      resultMsg.msg = "암호 변경 성공";
    }

  }catch(err){ 
    // 서버에러
    resultMsg.code = 500;
    resultMsg.data = null;
    resultMsg.msg = "서버 에러";
  }


  res.json(resultMsg);
})

module.exports = router;
