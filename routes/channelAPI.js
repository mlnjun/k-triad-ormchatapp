var express = require('express');
var router = express.Router();


/*
- 채널/채팅 정보 관리 RESTful API 라우팅 기능 제공
http://localhost:3000/api/channel
*/


var apiResult = {
  code:200,
  data:[],
  result:"OK"
}



// 채널 데이터
var channel = [
  {
    community_id:1,
    category_code:1,
    channel_name:"채팅방1",
    user_limit:2,
    channel_desc:"채팅방1 입니다.",
    channel_state_code:1,
    reg_date:Date.now(),
    reg_member_id:"A"
  },
  {
    community_id:2,
    category_code:2,
    channel_name:"채팅방2",
    user_limit:3,
    channel_desc:"채팅방2 입니다.",
    channel_state_code:2,
    reg_date:Date.now(),
    reg_member_id:"B"
  },
  {
    community_id:3,
    category_code:1,
    channel_name:"채팅방3",
    user_limit:2,
    channel_desc:"채팅방3 입니다.",
    channel_state_code:1,
    reg_date:Date.now(),
    reg_member_id:"C"
  }
]


// 채널 정보 관리 RESTful API 라우팅 기능 제공
// http://localhost:3000/api/channel/all
router.get('/all',async(req, res)=>{


  apiResult.code = 200;
  apiResult.data = channel;
  apiResult.result = "OK";

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
    apiResult.result = "OK";

  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
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
        apiResult.result = "OK";
        
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
    apiResult.result = "Failed";
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

})



module.exports = router;
