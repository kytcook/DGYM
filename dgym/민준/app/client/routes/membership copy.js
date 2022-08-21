window.onload = loadInfo;
user = firebase.auth().onAuthStateChanged();

// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
function loadInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const login = document.querySelector("#login");
      login.textContent = "logout";
      login.id = "logout";
      login.addEventListener("click", logout);
      login.classList.add("btn-danger");
      // console.log(user);
      // 마이페이지
      const div = document.querySelector(".btn-group");
      const mypage = document.createElement("a");
      mypage.setAttribute("href", "./views/mypage/membership.html");
      mypage.innerHTML = `
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        id="mypage"
                      >${user.displayName}님
                      </button>
                      `;
      div.appendChild(mypage);
      document.querySelector(
        "#mem_name"
      ).innerHTML = `이름 : ${user.displayName}`;
      // document.querySelector("#mem_email").innerHTML = `이메일 : ${user.email}`; ===> 필요없을 듯..

      const db = firebase.firestore();
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          document.querySelector("#mem_hp").innerHTML = `휴대폰 : ${
            snapshot.data().mem_hp
          }`;
        });
    }
  });
}

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

/**************************************************************************/
//모달창 자체 드래그로 움직이게 하기
$(function () {
  $(".modal-dialog").draggable({
    handle: ".modal-header",
  });
});

const user = firebase.auth().currentUser; //현재의 유저 인증 정보에 접근
const db = firebase.firestore(); //FB DB 에 접근
const storage = firebase.storage(); //FB storage 에 접근

//모달 내 우측하단, 수정하기 버튼 클릭 시 회원 정보 불러오기
$(".modybtn").click(function () {
  firebase.auth().onAuthStateChanged((user) => {
    $("#staticBackdrop").modal("show");
    const readModal = document.getElementById("staticBackdrop");
    readModal.addEventListener("shown.bs.modal", () => {
      console.log("사용자 id ===> " + user.uid);
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((result) => {
          const name = user.displayName;
          const hp = result.data().mem_hp;
          const birth = result.data().mem_birth;
          console.log(result.data());
          $("#mem_name").attr("value", name);
          $("#mem_hp").attr("value", hp);
          $("#mem_birth").attr("value", birth);
        });
      /*=============================== 회원탈퇴 Start ==================================*/
      document.getElementById("user_delete").addEventListener("click", (e) => {
        // 탈퇴하기가 눌리면 Firestore의 문서를 먼저 삭제합니다.
        const ok = window.confirm("정말로 탈퇴하시겠습니까?");
        if (ok) {
          db.collection("user")
            .doc(user.uid)
            .delete()
            .then(() => {
              console.log("Document successfully deleted!");
              // 사용자 Authentication의 uid가 삭제된 후 해당 문서도 삭제됩니다.
              user
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
        } else {
          alert("취소 되었습니다.");
          console.log("삭제 취소함");
        }
      });
      /*================================ 회원탈퇴 End ===================================*/
    });
  });
});

//수정 후 저장하기 버튼 클릭 시 변경된 값 읽어 db에 update
$(document).ready(function () {
  $("#mem_save").click(function () {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("사용자 id ===> " + user.uid);

      const mem_name = $("#mem_name").val();
      const mem_hp = $("#mem_hp").val();
      const mem_birth = $("#mem_birth").val();
      const image = $("#mem_img").val();

      //파일 업로드 관련
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
            console.log(
              "사용자가 선택한 이미지 파일 ===> " + selectedFile.name
            );
            uploadImg.snapshot.ref.getDownloadURL().then((url) => {
              db.collection("user").doc(user.uid).update({
                mem_hp: mem_hp,
                mem_birth: mem_birth,
                modi_date: new Date(),
                image: url, //업로드에 성공한 이미지 url 담기
              });
              user
                .updateProfile({ displayName: mem_name })
                .then(() => {
                  location.reload(); //데이터 추가 후 페이지 새로고침 처리
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          }
        );
      } else {
        // 이미지를 첨부하지 않은 경우
        db.collection("user").doc(user.uid).update({
          mem_hp: mem_hp,
          mem_birth: mem_birth,
          modi_date: new Date(),
        });
        user
          .updateProfile({ displayName: mem_name }) //이름바꾸는 메서드
          .then(() => {
            location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
});

//비밀번호 변경 모달창 내에 저장하기 버튼 클릭 시
$("#pw_save").click(function () {
  const newPW = $("#change_pw").val();
  const checkPW = $("#check_pw").val();
  firebase.auth().onAuthStateChanged((user) => {
    if (newPW == checkPW) {
      console.log("사용자가 입력한 PW ===> " + newPW);
      user
        .updatePassword(newPW)
        .then(() => {
          // Update successful.
          console.log("사용자 id ===> " + user.uid);
          window.alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
          window.location.replace("../member/login.html");
        })
        .catch(function (error) {
          // An error ocurred
          console.error("비밀번호 변경 시 에러: ", error);
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
  });
});

/********************** 은택님 코드 *************************/
firebase.auth().onAuthStateChanged(function (user) {
  // 현재 로그인된 사용자 대조 api
  // console.log(user.uid); // uid가져왔니??
  console.log();
  db.collection("user")
    .doc(user.uid)
    .get()
    .then((doc) => {
      data = doc.data();
      console.log(data);
      const template = `
                            <p>이름 : ${user.displayName}</p>
                            <p>이메일 : ${data.mem_email}</p>
                            <p>휴대폰번호 : ${data.mem_hp}</p>
                            <p>생년월일 : ${
                              data.mem_birth != null ? data.mem_birth : ""
                            }</p>
                            `;
      $("#intro-start").append(template);

      /////////////////////////// 이미지 분기 가져오기 ///////////////////////////
      // 만약 data.image가 없으면
      if (data.image === undefined) {
        console.log("사용자가 이미지를 첨부하지 않았음.");
        $("#image").append(
          // url주소는 fire.Storage에 미리 넣어둔 이미지. 파일위치 - 엑세스토큰
          `<img src="https://firebasestorage.googleapis.com/v0/b/d-gym-demo.appspot.com/o/image%2Fdefault_img.png?alt=media&token=9abc6848-2417-4ab9-a321-3a5bd229fee4"
          alt="프로필사진" class="img" width="250" height="250">`
        );
      } else {
        // 사용자가 선택한 파일 이미지 가져오기
        console.log("uid url : " + data.image);
        $("#image").append(
          `<img src=${data.image} alt="프로필사진" class="img" width="250" height="250">`
        );
      }
    });
});
