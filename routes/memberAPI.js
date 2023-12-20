var express = require('express');
var router = express.Router();


//회원 정보 관리 RESTful API 라우팅 기능 제공
// http://localhost:3000/api/member

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



// 회원 정보 관리 RESTful API 라우팅 기능 제공
// http://localhost:3000/api/member/all
router.get('/all',async(req, res)=>{
  res.json(member);
});


// 계정 생성
// http://localhost:3000/api/member/create
router.post('/create',async(req,res)=>{

  let newMember = req.body;


  member.push(newMember);


  res.json(member);

})


// 계정 정보 수정
// http://localhost:3000/api/member/modify/1
router.post('/modify/:uid',async(req,res)=>{
  
  try{
    // 입력 받기
    var member_id = req.params.uid;
    var email = req.body.email;
    var member_password = req.body.member_password;
    var name = req.body.name;
    var telephone = req.body.telephone;
    var birth_date = req.body.birth_date;
    var entry_type_code = req.body.entry_type_code;
    var use_state_code = req.body.use_state_code
    var reg_member_id = req.body.reg_member_id
  
  
    // 받은 입력값 객체
    let modifyMember = {
      member_id,
      email,
      member_password,
      name,
      telephone,
      birth_date,
      entry_type_code,
      use_state_code,
      reg_member_id
    }
  


    // 
    let index
  
  
    for(let i = 0; i<channel.length; i++){
      if(channel[i].community_id == community_id){
        channel[i] = modifyChdata;
        // console.log(channel[i])

        apiResult.code = 200;
        apiResult.data = channel;
        apiResult.result = "OK";

        res.json(apiResult);
        index = i;
        break;
      }
    }
  
  
  
    if(channel[index] == undefined){
      res.send("해당 계정은 존재하지 않습니다.");
    }

  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

})


// 계정 삭제
// http://localhost:3000/api/member/delete
router.post('/delete',async(req,res)=>{
  let userid = req.body.userid;
  let upassword = req.body.upassword;

  
  let index

  for(let i = 0; i<member.length; i++){
    if((member[i].userid == userid) && (member[i].upassword == upassword)){
      member.splice(i, 1);
      // console.log(channelData[i]);j
      res.json(member);
      index = i;
      break;
    }
  }



  if(member[index] == undefined){
    res.send("해당 계정은 존재하지 않습니다.");
  }
});


  // 단일 회원정보 데이터 조회 
// http://localhost:3000/api/member/cid
router.get('/mid/:userid',async(req,res)=>{
  let userid = req.params.userid;


  for(let i = 0; i<member.length; i++){
    if(member[i].userid == userid){
      res.json(member[i]);
      break;
    }
  }
  
})





module.exports = router;
