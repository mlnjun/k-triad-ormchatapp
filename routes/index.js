var express = require('express');
var router = express.Router();

var crypto = require('crypto')

var db = require('../models/index');
const { randomInt } = require('crypto');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

// 공통기능 제공 (로그인, 회원가입, 암호찾기)


/*
-로그인 웹페이지 요청 및 응답
호출 주소 : http://localhost:3000/login
GET
*/
router.get('/login',async(req, res)=>{
  
  res.render('login',{email:"",password:"", resultMsg:""});
});


/*
-로그인 처리 요청 및 응답, 로그인 완료 후 채팅 페이지 이동 처리
호출 주소 : http://localhost:3000/login
POST
*/
router.post('/login',async(req,res)=>{
  // 사용자 입력 id, pw 입력 받기
  let email = req.body.email;
  let member_password = req.body.password;

  
  // ID PW를 DB에서 찾기
  const loginMember = await db.Member.findOne({where:{email:email}});

  resultMsg = ""

  if(loginMember == null){
    // 이메일 틀림
    resultMsg = "해당 이메일은 존재하지 않습니다.";
  }else{
    if(loginMember.member_password === member_password){
      // 로그인 성공
      res.redirect('/chat');
    }else{
      // 암호 틀림
      resultMsg = "암호가 틀렸습니다.";
    }
  }


  if(resultMsg){
    res.render('login',{email:email, password:member_password, resultMsg:resultMsg});
  }


});


/*
-회원가입 웹페이지 요청 및 응답
호출 주소 : http://localhost:3000/entry
GET
*/
router.get('/entry',async(req, res)=>{
  res.render('entry');
});


/*
-회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
호출 주소 : http://localhost:3000/entry
POST
*/
router.post('/entry',async(req, res)=>{
  
// 회원가입 정보 입력 받기
// uid, upassword, userName, age, phone
let [entry_type_code, email, member_password, name, telephone, birth_date, profile_img_path] = [
  req.body.entry_type_code,
  req.body.email,
  req.body.password,
  req.body.name,
  req.body.telephone,
  req.body.birth_date,
  req.body.profile_img_path
];


// 데이터 json객체로 만들기
let newMember = {
  email,
  member_password,
  name,
  profile_img_path,
  telephone,
  entry_type_code,
  use_state_code:1,
  birth_date,
  reg_date:Date.now(),
  reg_member_id:crypto.randomInt(1, 100000)
}

  // DB에 새 계정 데이터 생성
  if(newMember.entry_type_code !== "0"){
    await db.Member.create(newMember);
    res.redirect('/login');
  }else{
    res.redirect('/entry');
  }


});



/*
-암호 찾기 웹페이지 요청 및 응답
호출 주소 : http://localhost:3000/find
GET
*/
router.get('/find',async(req, res)=>{
  res.render('find',{resultMsg:""});
});


/*
-회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
호출 주소 : http://localhost:3000/find
POST
*/
router.post('/find',async(req, res)=>{
    
  // 사용자 계정의 email 받기
  let email = req.body.email;
  let telephone = req.body.telephone;


  // 받은 email DB에서 유무 체크
  let foundMember = await db.Member.findOne({where:{email:email}});

  let resultMsg = ""

  if(foundMember === null){
    // 이메일 틀림
    resultMsg = "입력한 정보가 맞지 않습니다.";
    res.render('find',{resultMsg:resultMsg});
  }else{
    if(foundMember.telephone === telephone){
      // 해당 계정 존재 > 이메일 비밀번호 전송
      resultMsg = "해당 계정의 비밀번호를 찾았습니다.";
      res.render(
        'login',
        {
          email:email,
          password:foundMember.member_password,
          resultMsg:resultMsg
      });
    }else{
      // 전화번호 틀림
      resultMsg = "입력한 정보가 맞지 않습니다.";
      res.render('find',{resultMsg:resultMsg});
    }
  }
});


// 암호 초기화 페이지 요청 및 응답
router.get('/password-init', async(req,res)=>{
  var token = req.query.token;


  res.render('password-init', {token});
})


// 암호초기화 페이지 암호 초기화 처리
// POST
// http://lacalhost:3000/password-init?token=JWT
router.post('/password-init', async(req,res,next)=>{
  var resultMsg = {
    code:200,
    data:"",
    msg:""
  }
  
  // 쿼리스트링으로 받은 토큰에서 해당 계정 데이터 찾기
  var token = req.body.token;


  try{
    // 입력 값 받기
    var password = req.body.password;
  
  
    var tokenData = await jwt.verify(token, process.env.JWT_KEY);
  
    // DB에서 해당 토큰의 계정이 존재하는지 확인하기
    var checkTokenData = await db.Member.findOne({ where:{ member_id:tokenData.member_id } });
  
    if(checkTokenData == null){  // 토큰의 계정정보 DB에 존재하지 않음
      resultMsg.code = 400;
      resultMsg.data = null,
      resultMsg.msg = "해당 토큰의 계정은 존재하지 않습니다."

      res.json(resultMsg);
    }else{  // DB에 토큰의 계정정보 존재
      // 암호 변경 로직
      var encryptPassword = await bcrypt.hash(password, 12);

      var updatedMember = await db.Member.update({ member_password:encryptPassword }, { where:{ member_id:checkTokenData.member_id } });

      resultMsg.code = 200;
      resultMsg.data = updatedMember,
      resultMsg.msg = "성공"

      res.json(resultMsg);
    }

  }catch(err){
    console.log(err);

    resultMsg.code = 500;
    resultMsg.data = null,
    resultMsg.msg = "서버 에러"

    res.json(resultMsg);
  }

})







module.exports = router;