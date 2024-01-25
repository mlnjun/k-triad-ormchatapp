let invitedMembers = [{ member_id: '1' }, { member_id: '2' }, { member_id: '3' }, { member_id: 4 }];
const loginUserToken = localStorage.getItem('userAuthToken');

$('#GroupChatFormModalCloseBtn').click(clearGroupChatForm);
$('#createGroup').click(function (e) {
  var modal = document.getElementById('groupChatCreateModal');
  if (e.target !== modal && !modal.contains(e.target)) {
    // 클릭된 요소가 모달과 모달의 하위 요소들이 아니면 모달을 닫음
    console.log('설마 이 콜백은 아니겠지');
    console.log(e.target);
    console.log(modal.contains(e.target));
    clearGroupChatForm();
  }
});

$('#invitedMemberList').click(function (e) {
  e.stopPropagation();

  if (e.target.dataset.memberId) {
    invitedMembers = invitedMembers.filter((member) => {
      return member.member_id != e.target.dataset.memberId;
    });
  }

  console.log(invitedMembers);
});

$('#inviteMemberAddBtn').click(function () {
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
          invitedMembers.push(addedMember);
          // invitedMembers 리스트 화면에 반영
          appendMemberToList(addedMember);
        } else if (result.code == 400) {
          alert(result.msg);
          $('#invitedMemberEmail').val('');
          $('#invitedMemberEmail').focus();
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
      },
    });
  }
});

$('#createGroupChatForm').submit(async function () {
  const channel_name = $('#channel_name').val();

  // ===================================
  // 이미지가 있다면 이미지 먼저 보내서 저장하고 그 경로 받아서 처리해야할것임...
  // if ('이미지가 있다면') {
  // const 이미지 경로 = await 이미지 디비 저장 요청 api 결과인 이미지 패스
  // }
  // ===================================
  if (invitedMembers.length) {
    await $.ajax({
      type: 'POST',
      url: '/api/channel/addchatgroup',
      headers: {
        Authorization: `Bearer ${loginUserToken}`,
      },
      data: {
        channelName: channel_name,
        members: invitedMembers,
        profile: 'img/close.svg',
      },
      dataType: 'json',
      success: function (result) {
        if (result.code == 200) {
          alert('그룹채팅 생성이 완료되었습니다.');
          $('#GroupChatFormModalCloseBtn').click();
          // ============================
          // 내가 속한 그룹 채팅 목록 조회 다시 해서 뿌리기 ~
          // ============================
        } else if (result.code == 400) {
          // 채널명 중복시 경고창
          alert(result.msg);
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
        alert('그룹채팅 생성 중 문제가 발생했습니다.');
      },
    });
  } else {
    alert('그룹채팅의 대화멤버를 추가해주세요.');
  }
  return false;
});

$('#uploadGroupChatImg').change(previewImage);

// =========== 함수들 정의 ===================

function makeStackedUserHTML(member) {
  return `<div class="stacked-user">
            <img src="${member.profile_img_path}" alt="User" />
            <span class="delete-user" data-member-id="${member.member_id}">
              <img src="img/close.svg" alt="Remove User" data-member-id="${member.member_id}" />
            </span>
          </div>`;
}

function appendMemberToList(member) {
  const memberElem = makeStackedUserHTML(member);

  $('#invitedMemberList').append(memberElem);
}

function renderInviteMembers(members) {
  $('#invitedMemberList').empty();

  members.forEach((member) => {
    appendMemberToList(member);
  });
}

function clearGroupChatForm() {
  console.log('clearGroupChatForm');

  $('#uploadGroupChatImg').val('');
  document.getElementById('previewImage').src = 'img/group2.svg';
  $('#invitedMemberEmail').val('');
  $('#channel_name').val('');
  invitedMembers = [];
  $('#invitedMemberList').empty();
}

function previewImage() {
  var input = document.getElementById('uploadGroupChatImg');
  var preview = document.getElementById('previewImage');
  var file = input.files[0];

  var reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = 'img/group2.svg'; // 기본 이미지 설정
  }
}
