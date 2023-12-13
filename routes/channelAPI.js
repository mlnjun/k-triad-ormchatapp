var express = require('express');
var router = express.Router();


/*
- 채널/채팅 정보 관리 RESTful API 라우팅 기능 제공
http://localhost:3000/api/channel
*/


// 채널 데이터
let channelData = [
  {
    chName : "A",
    chDescription : "A 채널",
    chid : 1
  },
  {
    chName : "B",
    chDescription : "B 채널",
    chid : 2
  },
  {
    chName : "C",
    chDescription : "C 채널",
    chid : 3
  }
]


// 채널 정보 관리 RESTful API 라우팅 기능 제공
// http://localhost:3000/api/channel/all
router.get('/all',async(req, res)=>{
  res.json(channelData);
});


// 채널 생성 요청과 응답 메소드
// http://localhost:3000/api/channel/create
router.post('/create',async(req,res)=>{
  var chName = req.body.chName;
  var chDescription = req.body.chDescription;
  var chid = req.body.chid;

  var newChdata = {
    chName,
    chDescription,
    chid
  }

  channelData.push(newChdata);

  // DB에 데이터 저장

  // 저장 후 
  res.json(channelData);

})


// 채널 수정 요청과 응답 메소드
// http://localhost:3000/api/channel/modify
router.post('/modify',async(req,res)=>{
  let {chName, chDescription, chid} = req.body;


  let modifyChdata = {
    chName,
    chDescription,
    chid
  }

  let index


  for(let i = 0; i<channelData.length; i++){
    if(channelData[i].chid == chid){
      channelData[i] = modifyChdata;
      // console.log(channelData[i])
      res.json(channelData[i]);
      index = i;
      break;
    }
  }


  if(channelData[index] == undefined){
    res.send("해당 계정은 존재하지 않습니다.");
  }

})


// 채널 삭제
// http://localhost:3000/api/channel/delete
router.post('/delete',async(req,res)=>{
  let chid = req.body.chid;

  let index


  for(let i = 0; i<channelData.length; i++){
    if(channelData[i].chid == chid){
      channelData.splice(i, 1);
      // console.log(channelData[i]);j
      res.json(channelData);
      index = i;
      break;
    }
  }


  if(channelData[index] == undefined){
    res.send("해당 계정은 존재하지 않습니다.");
  }
});


// 단일 채널 찾기
// http://localhost:3000/api/channel/cid
router.get('/cid/:chName',async(req, res)=>{
  let chName = req.params.chName;


  for(let i = 0; i<channelData.length; i++){
    if(channelData[i].chName == chName){
      res.json(channelData[i]);
      break;
    }
  }


})



module.exports = router;
