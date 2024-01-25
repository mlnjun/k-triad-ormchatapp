let invitedMembers = [];
const loginUserToken = localStorage.getItem('userAuthToken');

// ========================================================
// 멤버 x 버튼 누르면 제외시키기
// ========================================================

$('#inviteMemberBtn').click(function () {
  const invitedMemberEmail = $('#invitedMemberEmail').val();

  if (invitedMemberEmail) {
    // 이미 추가해놓은 이메일인지 체크
    const isAdded = invitedMembers.find((member) => invitedMemberEmail === member.email);

    if (isAdded) {
      alert('이미 추가된 멤버입니다.');
      $('#invitedMemberEmail').val('');
      return;
    }

    // 존재하는 멤버인지 체크
    $.ajax({
      type: 'POST',
      url: '/api/member/invite',
      headers: {
        Authorization: `Bearer ${loginUserToken}`,
      },
      data: {
        email: invitedMemberEmail,
      },
      dataType: 'json',
      success: function (result) {
        if (result.code == 200) {
          const addedMember = result.data;

          // invitedMembers에 추가
          invitedMembers.push(result.data);

          // ============================
          // invitedMembers 리스트 화면에 반영
          // ============================
        } else if (result.code == 400) {
          alert(result.msg);
          $('#invitedMemberEmail').val('');
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
      },
    });
  }
});

$('#createGroupChatForm').submit(function () {
  const channel_name = $('#channel_name').val();
  // ============================
  // 채널명 중복 확인 (api 만들어지면 하기)
  // ============================
  // $.ajax();

  if (invitedMembers.length) {
    $.ajax({
      type: 'POST',
      url: '/api/channel/addchatgroup',
      headers: {
        Authorization: `Bearer ${loginUserToken}`,
      },
      data: {
        channel_name,
        invitedMembers,
        channel_img_path: 'img/close.svg',
      },
      dataType: 'json',
      success: function (result) {
        if (result.code == 200) {
          // ============================
          // 채팅생성 창 닫기
          // 그룹 채팅 목록 조회 다시 해서 뿌리기
          // ============================
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
        // ============================
        // 화면에 에러난거 표시하기
        // ============================
      },
    });
  } else {
    alert('그룹채팅의 대화멤버를 추가해주세요.');
  }
  return false;
});
