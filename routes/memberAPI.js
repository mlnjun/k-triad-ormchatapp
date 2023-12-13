const express = require('express');
const router = express.Router();

router.get('/all', (req, res) => {
  const members = [
    { id: 1, username: 'leenabi99', email: 'lyh0922@empas.com'},
    { id: 2, username: 'minjun', email: 'minjun@naver.com'},
    { id: 3, username: 'nara', email: 'nara@naver.com'}
  ];

  res.json({ members: members });
});


router.post('/create', (req, res) => {
  res.json({ message: '회원 등록이 완료되었습니다.' });
});

router.post('/modify', (req, res) => {
  res.json({ message: '회원 정보가 수정되었습니다.' });
});

router.post('/delete', (req, res) => {
  res.json({ message: '회원 정보가 삭제되었습니다.' });
});

router.get('/:mid', (req, res) => {
  const memberId = parseInt(req.params.mid);
  const members = [
    { id: 1, username: 'leenabi99', email: 'lyh0922@empas.com'},
    { id: 2, username: 'minjun', email: 'minjun@naver.com'},
    { id: 3, username: 'nara', email: 'nara@naver.com'}
  ];
  const foundMember = members.find(member => member.id === memberId);
  if (foundMember) {
    res.json({ member: foundMember });
  } else {
    res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
  }
});


module.exports = router;

