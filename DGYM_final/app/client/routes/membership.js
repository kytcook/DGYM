const db = firebase.firestore();
const user = firebase.auth().currentUser; //현재의 유저 인증 정보에 접근
const storage = firebase.storage(); //FB storage 에 접근
window.onload = loadInfo;
// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
let thisUser = null;
function loadInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let userName = null;
      user.displayName != null
        ? (userName = user.displayName)
        : (userName = "익명회원");
      thisUser = user;
      const login = document.querySelector("#login");
      login.textContent = "logout";
      login.id = "logout";
      login.addEventListener("click", logout);
      login.classList.add("btn-danger");
      const div = document.querySelector(".btn-group");
      const mypage = document.createElement("a");
      mypage.setAttribute("href", "./membership.html");
      mypage.innerHTML = `
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        id="mypage"
                      >${userName}님
                      </button>
                      `;
      div.appendChild(mypage);
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((doc) => {
          data = doc.data();
          const template = `
            <p>이름: ${user.displayName != null ? user.displayName : ``}</p>
            <p>이메일: ${data.mem_email != null ? user.email : ``}</p>
            <p>휴대폰번호: ${data.mem_hp != null ? data.mem_hp : ``}</p>
            <p>생년월일: ${data.mem_birth != null ? data.mem_birth : ``}</p>
            `;
          /////////////////////////// 이미지 분기 가져오기 ///////////////////////////
          if (data.image === undefined) {
            $("#image").append(
              // url주소는 fire.Storage에 미리 넣어둔 이미지. 파일위치 - 엑세스토큰
              `<img src="https://firebasestorage.googleapis.com/v0/b/d-gym-demo.appspot.com/o/image%2Fdefault_img.png?alt=media&token=9abc6848-2417-4ab9-a321-3a5bd229fee4"
          alt="프로필사진" class="img" style="width:250px; height:250px";>`
            );
          } else {
            // 사용자가 선택한 파일 이미지 가져오기
            $("#image").append(
              `<img src=${data.image} alt="프로필사진" class="img" style=" width:250px; height=250px; border-radius:10px">`
            );
          }
          $("#intro-start").append(template);
        });
    }
  });
}

//모달창 자체 드래그로 움직이게 하기
$(function () {
  $(".modal-dialog").draggable({
    handle: ".modal-header",
  });
});

//모달 내 우측하단, 수정하기 버튼 클릭 시 회원 정보 불러오기
$(".modybtn").click(function () {
  showModal(thisUser);
});

$("#pw_save").click(function () {
  changePw(thisUser);
});

function showModal(thisUser) {
  // 모달창 닫고 다시 눌렀을 때 초기화 시켜줘야 밑에 쌓이지 않는다
  $("#modal-memberData").empty();
  $("#staticBackdrop").modal("show");
  const readModal = document.getElementById("staticBackdrop");
  // readModal.addEventListener("shown.bs.modal", () => {
  db.collection("user")
    .doc(thisUser.uid)
    .get()
    .then((result) => {
      let name = thisUser.displayName;
      let email = result.data().mem_email;
      let hp = result.data().mem_hp;
      let birth =
        result.data().mem_birth == undefined
          ? "입력하세요"
          : result.data().mem_birth;
      let template = `
              <div class="card-body">
                <div class="col-md-7 d-flex mb-lg-2">
                  <label class="form-label" for="name" style="width: 65%"
                    >이름</label
                  >
                  <input
                    class="form-control form-control-sm"
                    id="mem_name"
                    type="text"
                    value=${name != null ? name : `입력하세요`}
                  />
                </div>
                <div class="col-md-7 d-flex mb-lg-2">
                  <label class="form-label" for="name" style="width: 65%"
                    >이메일</label
                  >
                  <input
                    class="form-control form-control-sm"
                    id="mem_email"
                    type="text"
                    value=${email != null ? email : `입력하세요`}
                  />
                </div>
                <div class="col-md-7 d-flex mb-lg-2">
                  <label class="form-label" for="working-day" style="width: 65%"
                    >핸드폰번호</label
                  >
                  <input
                    class="form-control form-control-sm"
                    id="mem_hp"
                    type="text"
                    value=${hp != null ? hp : `입력하세요`}
                  />
                </div>
                <div class="col-md-7 d-flex mb-lg-2">
                  <label
                    class="form-label"
                    for="working-time"
                    style="width: 65%"
                    >생년월일</label
                  >
                  <input
                    class="form-control form-control-sm"
                    id="mem_birth"
                    type="text"
                    value=${birth != null ? birth : `입력하세요`}
                  />
                </div>
                <div class="col-md-12 d-flex mb-lg-3">
                  <label class="form-label" for="student" style="width: 35%;"
                    ><b>프로필 사진 첨부🙍🏻‍♀️</b></label
                  >
                  <input type="file" id="mem_img"class="col-md-6" />
                </div>
              </div>
            <div class="modal-footer d-flex">
              <button
              id="deleteBtn"
              type="button"
              class="btn btn-danger justify-content-start"
              
              >
              회원탈퇴
            </button>
            
            <button
              type="submit"
              class="btn btn-default border-dark"
              data-bs-dismiss="modal"
              id="saveBtn"
            >
              저장하기
            </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                닫기
              </button>
              </div>
      `;
      $("#modal-memberData").append(template);

      $("#saveBtn").on("click", function () {
        userSave(thisUser);
      });
      $("#deleteBtn").on("click", function () {
        userDelete(thisUser);
      });
    });
}

// 내 정보 수정 안의 회원탈퇴 처리 함수
function userDelete(thisUser) {
  const ok = window.confirm("회원 탈퇴하시겠습니까?");
  if (ok) {
    let isOk = window.confirm("정말로 탈퇴하시겠습니까?");
    if (isOk) {
      db.collection("user")
        .doc(thisUser.uid)
        .delete()
        .then(() => {
          thisUser
            .delete()
            .then(() => {
              alert("회원탈퇴 되었습니다. \n이용해주셔서 감사합니다.");
              window.location.replace("../member/login.html");
            })
            .catch(function (error) {
              console.log(error);
              if (error.code == "auth/requires-recent-login") {
                window.alert(
                  "로그인 후 일정시간이 경과되어 재로그인이 필요합니다. 비밀번호 변경을 위해 로그인 화면으로 돌아갑니다."
                );
                window.location.replace("../member/login.html");
              }
            });
        });
    } else alert("취소 되었습니다.");
  } else alert("취소 되었습니다");
}
// 내정보 수정안의 저장하기 처리 함수
function userSave(thisUser) {
  const today = new Date();
  const year = String(today.getFullYear()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const mem_name = $("#mem_name").val();
  const mem_email = $("#mem_email").val();
  const mem_hp = $("#mem_hp").val();
  const mem_birth = $("#mem_birth").val();
  const image = $("#mem_img").val();
  // files[0]은 querySelector로 선택된 파일에 접근할 수 있도록
  if (image !== "") {
    //이미지를 첨부한 경우 ====> 사용자가 선택한 이미지 url을 얻어 db에 저장.
    const selectedFile = document.querySelector("#mem_img").files[0];
    const storageRef = storage.ref();
    const storagePath = storageRef.child("image/" + selectedFile.name);
    const uploadImg = storagePath.put(selectedFile);
    uploadImg.on(
      "state_change",
      null,
      (error) => {
        console.error(error);
      },
      function () {
        // 성공시 동작하는 함수
        // console.log("사용자가 선택한 이미지 파일 ===> " + selectedFile.name);
        uploadImg.snapshot.ref.getDownloadURL().then((url) => {
          db.collection("user")
            .doc(thisUser.uid)
            .update({
              mem_name: mem_name,
              mem_email: mem_email,
              mem_hp: mem_hp,
              mem_birth: mem_birth,
              modi_date: `${year}-${month}-${date}`,
              image: url, //업로드에 성공한 이미지 url 담기
            });
          thisUser
            .updateProfile({ displayName: mem_name })
            .then(() => {
              location.reload(); //데이터 추가 후 페이지 새로고침 처리
            })
            .catch((err) => {
              alert("업로드중 오류가 발생했습니다");
              location.reload();
            });
        });
      }
    );
  } else {
    // 이미지를 첨부하지 않은 경우
    db.collection("user").doc(thisUser.uid).update({
      mem_name: mem_name,
      mem_email: mem_email,
      mem_hp: mem_hp,
      mem_birth: mem_birth,
      modi_date: new Date(),
    });
    thisUser
      .updateProfile({ displayName: mem_name }) //이름바꾸는 메서드
      .then(() => {
        location.reload();
      });
  }
}

function changePw(thisUser) {
  //비밀번호 변경 모달창 내에 저장하기 버튼 클릭 시
  const newPW = $("#change_pw").val();
  const checkPW = $("#check_pw").val();
  if (newPW == checkPW) {
    thisUser
      .updatePassword(newPW)
      .then(() => {
        window.alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        window.location.replace("../member/login.html");
      })
      .catch(function (error) {
        switch (error.code) {
          case "auth/requires-recent-login":
            window.alert(
              "로그인 후 일정시간이 경과되어 재로그인이 필요합니다. 비밀번호 변경을 위해 로그인 화면으로 돌아갑니다."
            );
            window.location.replace("../member/login.html");
            break;
          case "auth/weak-password":
            window.alert("비밀번호는 6자 이상으로 변경해주세요.");
            break;
        }
      });
  } else {
    window.alert("입력하신 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
  }
}
// 로그아웃
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("로그아웃 처리 되었습니다");
      window.location.replace("../../../index.html");
    })
    .catch((error) => {
      console.log(error);
    });
}
