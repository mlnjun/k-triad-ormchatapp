var express = require('express');
var router = express.Router();

// 공통기능 제공 (로그인, 회원가입, 암호찾기)


// 임시 DB
var member = [
  {
    member_id:1,
    email:"qwe123@gmail.com",
    member_password:"qwe123",
    name:"A",
    telephone:"010-9999-9999",
    birth_date:"2000-01-01",
    entry_type_code:1,
    use_state_code:1,
    reg_member_id:1,
    reg_date:Date.now()
  },
  {
    member_id:2,
    email:"asd123@gmail.com",
    member_password:"asd123",
    name:"B",
    telephone:"010-8888-8888",
    birth_date:"2000-01-01",
    entry_type_code:2,
    use_state_code:2,
    reg_member_id:2,
    reg_date:Date.now()
  },
  {
    member_id:3,
    email:"zxc123@gmail.com",
    member_password:"zxc123",
    name:"C",
    telephone:"010-7777-7777",
    birth_date:"2000-01-01",
    entry_type_code:2,
    use_state_code:1,
    reg_member_id:3,
    reg_date:Date.now()
  },
]

/*
-로그인 웹페이지 요청 및 응답
호출 주소 : http://localhost:3000/login
GET
*/
router.get('/login',async(req, res)=>{
  
  res.render('login',{upassword:""});
});


/*
-로그인 처리 요청 및 응답, 로그인 완료 후 채팅 페이지 이동 처리
호출 주소 : http://localhost:3000/login
POST
*/
router.post('/login',async(req,res)=>{
  // 사용자 입력 id, pw 입력 받기
  let email = req.body.uid;
  let member_password = req.body.upassword;


  // ID PW를 DB에서 찾기
  let foundEmail = member.find(function(e){
    return email === e.email
  });

  let foundPassword = member.find(function(pw){
    return member_password === pw.member_password
  });


  if(foundEmail === undefined &&  foundPassword === undefined){
    res.redirect('/login')
  }else{
    // 로그인 일치하는 ID,PW 있을시 채팅 페이지 이동처리
    res.redirect('/chat');
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
let [email, member_password, name, birth_date, telephone, entry_type_code] = [
  req.body.uid,
  req.body.upassword,
  req.body.name,
  req.body.birth,
  req.body.telephone,
  req.body.entry_type_code
];


// 데이터 json객체로 만들기
let userMember = {
  member_id:member.length+2,
  email,
  member_password,
  name,
  telephone,
  birth_date,
  entry_type_code,
  use_state_code:1,
  reg_member_id:member.length+2,
  reg_date:Date.now()
}


let userMemberValue = Object.values(userMember);


if(userMemberValue.includes("")){
  // 입력값 존재하지 않을 때 거부하기
  res.redirect('/entry');
}else{
  // 받은 회원가입 정보 DB에 추가하기
  member.push(userMember);
  
  // 로그인 페이지 이동 처리
  res.redirect('/login');

}

});



/*
-암호 찾기 웹페이지 요청 및 응답
호출 주소 : http://localhost:3000/find
GET
*/
router.get('/find',async(req, res)=>{
  res.render('find');
});


/*
-회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
호출 주소 : http://localhost:3000/find
POST
*/
router.post('/find',async(req, res)=>{
    
  // 사용자 계정의 email 받기
  let email = req.body.email;


  // 받은 email DB에서 유무 체크
  let foundEmail = member.find(function(e){
    return e.email === email;
  })


  if(foundEmail){
    for(let i=0; i<member.length; i++){
      if(member[i].email === foundEmail.email){
        // 로그인 페이지 이동 처리
        res.render('login', {upassword:member[i].member_password});
        return false;
      }
    }
  }
  
  res.redirect('/find');
  

  // DB에서 해당 email의 계정 PW 데이터 전송

});










module.exports = router;