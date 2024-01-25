var express = require('express');
var router = express.Router();


// DB 참조
var db = require('../models/index');

// 단방향 암호화를 위한 bcrypt 패키지 참조 (비밀번호와 같은 민감한 정보를 안전하게 저장)
const bcrypt = require('bcryptjs');

// 양방향 암호화 및 복호화를 위한 mysql-aes 패키지 참조
const AES = require('mysql-aes');

// jsonwebtoken패키지 참조
const jwt = require('jsonwebtoken');

// multer 패키지 참조
var multer = require('multer');

// moment 패키지 참조
const moment = require('moment');

// -파일저장위치 지정 (해당 라우터)
var storage  = multer.diskStorage({ 
    destination(req, file, cb) {
      cb(null, 'public/upload/channel/');
    },
    filename(req, file, cb) {
      cb(null, `${moment(Date.now()).format('YYYYMMddHHmmss')}__${file.originalname}`);
    },
  });


//일반 업로드처리 객체 생성
var upload = multer({ storage: storage });

// 토큰 인증 미들웨어 참조
var {tokenAuthChecking} = require('./apiMiddleware');


/*
- 채널/채팅 정보 관리 RESTful API 라우팅 기능 제공
http://localhost:3000/api/channel
*/


var apiResult = {
  code:200,
  data:null,
  msg:"OK"
}


// 채널 정보 관리 RESTful API 라우팅 기능 제공
// http://localhost:3000/api/channel/all
router.get('/all',async(req, res)=>{


  apiResult.code = 200;
  apiResult.data = channel;
  apiResult.msg = "OK";

  res.json(apiResult);
});


// 채널 생성 요청과 응답 메소드
// http://localhost:3000/api/channel/create
router.post('/create',async(req,res)=>{
  
  try{
    var channel_name = req.body.channel_name;
    var channel_desc = req.body.channel_desc;
    var user_limit = req.body.user_limit;
    var category_code = req.body.category_code;
    var channel_state_code = req.body.channel_state_code;
    var reg_member_id = req.body.reg_member_id;
  
    var newChdata =   {
      community_id:++channel.length,
      category_code,
      channel_name,
      user_limit,
      channel_desc,
      channel_state_code,
      reg_date:Date.now(),
      reg_member_id
    }

    channel.push(newChdata);

    apiResult.code = 200;
    apiResult.data = newChdata;
    apiResult.msg = "OK";

  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }




  // DB에 데이터 저장


  // 저장 후
  res.json(apiResult);

})


// 채널 수정 요청과 응답 메소드
// http://localhost:3000/api/channel/modify/1
router.post('/modify/:cid',async(req,res)=>{
  
  try{
    // 입력 받기
    var community_id = req.params.cid;
    var channel_name = req.body.channel_name;
    var channel_desc = req.body.channel_desc;
    var user_limit = req.body.user_limit;
    var category_code = req.body.category_code;
    var channel_state_code = req.body.channel_state_code;
    var reg_member_id = req.body.reg_member_id;
  
  
    // 받은 입력값 객체
    let modifyChdata = {
      community_id,
      category_code,
      channel_name,
      user_limit,
      channel_desc,
      channel_state_code,
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
        apiResult.msg = "OK";

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
    apiResult.msg = "Failed";
  }

})


// 채널 삭제
// http://localhost:3000/api/channel/delete/1
router.delete('/delete/:cid',async(req,res)=>{

  try{
    // 삭제 채널 id 파라미터 방식으로 받기
    let community_id = req.params.cid;
  
  
    // for 반복문으로 channel index 돌아가며 해당 id가 추적하기
    let index
  
  
    for(let i = 0; i<channel.length; i++){
      if(channel[i].community_id == community_id){
        channel.splice(i, 1);

        apiResult.code = 200;
        apiResult.data = channel;
        apiResult.msg = "OK";
        
        index = i;

        res.json(apiResult);
        break;
      }
    }
  
  
    if(index == channel.length){
      res.send("해당 계정은 존재하지 않습니다.");
    }

  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }
});


// 단일 채널 찾기
// http://localhost:3000/api/channel/1
router.get('/:cid',async(req, res)=>{
  let community_id = req.params.cid;


  let index

  for(let i = 0; i<channel.length; i++){
    if(channel[i].community_id == community_id){
      res.json(channel[i]);
      index = i;
      break;
    }
  }

  if(channel[index] === undefined){
    res.send("해당 계정은 존재하지 않습니다.");
  }

});


// 채널 프로필 이미지 저장
// http://localhost:3000/api/channel/uploadprofile
// router.post('/uploadprofile', upload.single('file'), async(req,res,next)=>{

//   try{
//     // 파일 받기
//     const profile = req.file

//     // 토큰 받기
//     var tokenData = req.headers.authorization

//     if(profile){
//       var filePath ="/upload/"+uploadFile.filename;  // 서버에 실제 업로드된 물리적인 파일명-도메인주소가 생략된 파일링크주소
//       var fileName = uploadFile.filename;  // 서버에 저장된 실제 물리파일명(파일명/확장자 포함)
//       var fileOrignalName = uploadFile.originalname;  // 클라이언트에서 선택한 오리지널 파일명
//       var fileSize = uploadFile.size;  // 파일 크기(KB)
//       var fileType = uploadFile.mimetype;  // 파일포맷
  
//       var file = {
//           article_id : registedArticle.article_id,
//           file_name : fileOrignalName,
//           file_size : fileSize,
//           file_path : filePath,
//           file_type : fileType,
//           reg_date : Date.now(),
//           reg_member_id : 1
//       };
//     }
    
//   }catch(err){

//   }

// });


// 그룹 채팅 생성
// http://localhost:3000/api/channel/addchatgroup
router.post('/addchatgroup', async(req,res,next)=>{

  try{
    // 데이터 받기
    var inviteMember = req.body.members;
    var profilePath = req.body.profile;
    var channelName = req.body.channelName;
    var token = req.headers.authorization.split(' ')[1];

    // 토큰 데이터 추출
    var tokenData = await jwt.verify(token, process.env.JWT_KEY);

    // 채널 이름 중복 체크
    var isNameSame = await db.Channel.findOne({where:{channel_name:channelName}});


    if(isNameSame == null){
      // 채널 이름 중복 X > 정상 진행

      // channel 데이터 DB에 넣기
      var channelData = {
        comunity_id:1,
        category_code:2,
        channel_name:channelName,
        user_limit:inviteMember.length+1,
        channel_img_path:profilePath,
        channel_desc:"",
        channel_state_code:1,
        reg_date:Date.now(),
        reg_member_id:tokenData.member_id
      };
      // 채널 생성
      await db.Channel.create(channelData);
      // 채널 데이터 받기
      var channel = await db.Channel.findOne({where:{channel_name:channelName}});


      // channelMember DB에 넣기
      // 관리자(채널 생성자) 데이터
      var channelMember = {
        channel_id:channel.channel_id,
        member_id:tokenData.member_id,
        nick_name:tokenData.name,
        member_type_code:1,
        active_state_code:1,
      }
      
      await db.ChannelMember.create(channelMember);

      // 모든 초대된 사용자 DB에 추가
      for(let i = 0; i < inviteMember.length; i++){
        // 사용자 데이터
        var channelMember = {
          channel_id:channel.channel_id,
          member_id:inviteMember[i].member_id,
          nick_name:inviteMember[i].name,
          member_type_code:0,
          active_state_code:1,
        }

        // DB에 추가
        await db.ChannelMember.create(channelMember)
      };


      apiResult.code = 200;
      apiResult.data = null;
      apiResult.msg = "생성 완료";

    }else{
      // 채널 이름 중복
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.msg = "동일한 그룹 이름이 존재합니다.";
    }



  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "서버에러";
  }

  res.json(apiResult);
});


module.exports = router;
