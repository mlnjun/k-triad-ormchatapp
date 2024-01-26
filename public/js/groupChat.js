let invitedMembers = [];
let chatProfileImagePath = null;

// 그룹 채널 목록 조회
$("#groups-tab").click(function () {
  var loginUserToken = localStorage.getItem("userauthtoken");

  // AJAX로 사용자가 속한 그룹 채널 목록 조회 데이터 바인딩 처리
  $.ajax({
      type: "POST",
      url: "/api/channel/channelsByMember",
      headers: {
          Authorization: `Bearer ${loginUserToken}`,
      },
      dataType: "json",
      success: function (result) {
          console.log("사용자가 속한 그룹 채널 목록 조회 결과: ", result);

          if (result.code == 200) {
              // 최초 UL 태그내 LI 태그 모두 삭제처리
              $(".group-chat-cards").html("");

              $.each(result.data, function (index, channel) {
                  var groupTag = `<li onClick="fnGroupChatEntry(${channel.channel_id},${channel.channel_name},2)">
                          <a href="#">
                              <div class="groups-list-body">
                                  <div class="groups-msg">
                                      <h6 class="text-truncate">${channel.channel_name}</h6>
                                      <p class="text-truncate">그룹 채널 멤버 수: ${channel.user_limit}</p>
                                  </div>
                              </div>
                          </a>
                      </li>`;

                  $(".group-chat-cards").append(groupTag);
              });
          } else {
              if (result.code == 400) {
                  alert(result.code);
              }
          }
      },
      error: function (err) {
          console.log("백엔드 API 호출 에러발생:", err);
      },
  });
});


// 그룹챗 모달 닫기버튼 누르거나 모달 바깥영역 누르면 폼 초기화하기
$('#GroupChatFormModalCloseBtn').click(clearGroupChatForm);
$('#createGroup').click(function (e) {
  var modal = document.getElementById('groupChatCreateModal');
  if (e.target !== modal && !modal.contains(e.target)) {
    // 클릭된 요소가 모달과 모달의 하위 요소들이 아니면 모달을 닫음
    console.log('설마여기!!!!!');
    console.log(e.target);
    console.log(modal.contains(e.target));
    clearGroupChatForm();
  }
});

$('#uploadGroupChatImg').change(function () {
  previewImage();
});

// 이메일 입력후 ADD 버튼 누르면 그룹챗 멤버로 추가
$('#inviteMemberAddBtn').click(async function () {
  const invitedMemberEmail = $('#invitedMemberEmail').val();

  if (invitedMemberEmail && userProfileInfo) {
    // 사용자 자신인지 체크
    const isUserSelf = userProfileInfo.email == invitedMemberEmail;
    if (isUserSelf) {
      alert('본인을 제외한 사용자를 추가해주세요.');
      $('#invitedMemberEmail').val('');
      return;
    }

    // 이미 추가해놓은 이메일인지 체크
    const isAdded = invitedMembers.find((member) => invitedMemberEmail === member.email);

    if (isAdded) {
      alert('이미 추가된 멤버입니다.');
      $('#invitedMemberEmail').val('');
      return;
    }

    // 존재하는 멤버인지 체크
    await $.ajax({
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
          alert('해당 email의 사용자가 존재하지 않습니다.');
          $('#invitedMemberEmail').val('');
          $('#invitedMemberEmail').focus();
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
      },
    });
  } else {
    alert('초대할 사용자의 이메일을 입력해주세요.');
    $('#invitedMemberEmail').focus();
  }
});

// 초대할 사용자 삭제버튼 클릭 이벤트핸들러(부모요소에 이벤트 위임함)
$('#invitedMemberList').click(function (e) {
  e.stopPropagation();

  if (e.target.dataset.memberId) {
    invitedMembers = invitedMembers.filter((member) => {
      return member.member_id != e.target.dataset.memberId;
    });

    renderInviteMembers(invitedMembers);
    console.log(`member_id(${e.target.dataset.memberId}) 삭제 후 멤버 리스트`, invitedMembers);
  }
});

$('#createGroupChatForm').submit(async function (e) {
  const channel_name = $('#channel_name').val();

  const inputGroupChatImg = document.getElementById('uploadGroupChatImg');
  const file = inputGroupChatImg.files[0];

  if (file) {
    console.log('그룹챗 이미지 업로드');
    await $.ajax({
      type: 'POST',
      url: '/api/channel/uploadprofile',
      headers: {
        Authorization: `Bearer ${loginUserToken}`,
      },
      data: file,
      success: function (result) {
        if (result.code == 200) {
          console.log('그룹챗 이미지 업로드 완료~~~');
          chatProfileImagePath = result.data;
        } else {
          alert('이미지 업로드 중 문제가 발생했습니다.');
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
        alert('이미지 업로드 중 문제가 발생했습니다.');
      },
    });
  }
  // ===================================
  if (invitedMembers.length) {
    e.preventDefault();
    await $.ajax({
      type: 'POST',
      url: '/api/channel/addchatgroup',
      headers: {
        Authorization: `Bearer ${loginUserToken}`,
      },
      data: {
        channelName: channel_name,
        members: JSON.stringify(invitedMembers),
        profile: chatProfileImagePath || 'img/close.svg',
      },
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if (result.code == 200) {
          e.preventDefault();
          alert('그룹채팅 생성이 완료되었습니다.');
          $('#GroupChatFormModalCloseBtn').click();
          // ============================
          // 내가 속한 그룹 채팅 목록 조회 다시 해서 뿌리기 ~
          // ============================
        } else if (result.code == 400) {
          // 채널명 중복시 경고창
          alert(result.msg);
        } else {
          alert(result.msg);
        }
      },
      error: function (err) {
        console.log('api 호출 에러: ', err);
        alert('그룹채팅 생성 중 문제가 발생했습니다.');
      },
    });
    e.preventDefault();
  } else {
    alert('그룹채팅의 대화멤버를 추가해주세요.');
  }

  e.preventDefault();
  return false;
});

// =========== 함수들 정의 ===================

function makeStackedUserHTML(member) {
  return `<div class="stacked-user">
            <img src="${member?.profile_img_path || 'img/close.svg'}" alt="User" />
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

  $('#uploadGroupChatImg').attr('src', '');
  document.getElementById('previewImage').src = 'img/group2.svg';
  $('#invitedMemberEmail').val('');
  $('#channel_name').val('');
  invitedMembers = [];
  $('#invitedMemberList').empty();
}

function previewImage() {
  var inputGroupChatImg = document.getElementById('uploadGroupChatImg');
  var preview = document.getElementById('previewImage');
  var file = inputGroupChatImg.files[0];

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
