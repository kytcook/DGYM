//모달창 자체 드래그로 움직이게 하기
$(function () {
  $(".modal-dialog").draggable({
    handle: ".modal-header",
  });
});

const user = firebase.auth().currentUser; //현재의 유저 인증 정보에 접근?
const db = firebase.firestore(); //FB DB 에 접근
const storage = firebase.storage(); //FB storage 에 접근

//모달 내 우측하단, 수정하기 버튼 클릭 시 회원 정보 불러오기
$(".modybtn").click(function () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
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
      });
    }
  });
});

//수정 후 저장하기 버튼 클릭 시 변경된 값 읽어 db에 update 후 화면에 띄우기
$(document).ready(function () {
  $("#mem_save").click(function () {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("사용자 id ===> " + user.uid);

      const mem_name = $("#mem_name").val();
      const mem_hp = $("#mem_hp").val();
      const mem_birth = $("#mem_birth").val();

      //파일 업로드 관련
      // files[0]은 querySelector로 선택된 파일에 접근할 수 있도록
      const selectedFile = document.querySelector("#mem_img").files[0];
      const storageRef = storage.ref();
      const storagePath = storageRef.child("image/" + selectedFile.name);
      const uploadImg = storagePath.put(selectedFile);

      if (user) {
        uploadImg.on(
          "state_change",
          null,
          (error) => {
            console.error(error);
          },
          function () {
            uploadImg.snapshot.ref.getDownloadURL().then((url) => {
              console.log(
                "사용자가 선택한 이미지 파일 ===> " + selectedFile.name
              );

              db.collection("user")
                .doc(user.uid)
                .update({
                  mem_name: mem_name,
                  mem_hp: mem_hp,
                  mem_birth: mem_birth,
                  modi_date: new Date(),
                  image: url, //업로드에 성공한 이미지 url 담기
                })
                .then(() => {
                  // window.location.href = "membership.html";
                  location.reload(); //데이터 추가 후 페이지 새로고침 처리
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          }
        );
      }
    });
  });
});

//비밀번호 변경 부분
//비밀번호 변경 모달창 내에 저장하기 버튼 클릭 시
$("#pw_save").click(function () {
  const newPW = $("#mem_password").val();
  //여기
  firebase.auth().onAuthStateChanged((user) => {
    // reauthenticate = (password) => {
    //   var user = firebase.auth().currentUser;
    // var cred = firebase.auth.EmailAuthProvider.credential(
    //   user.email,
    //   user.password
    // );
    //   return user.reauthenticateWithCredential(cred);
    // };
    // user.auth.reauthenticate(cred).then(() => {
    // console.log("User reauthenticated");
    user
      // .reauthenticate(cred)
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
              "비밀번호 변경하기 위해서는 최근 인증이 필요합니다. 이 요청을 재시도하기 전에 다시 로그인하십시오."
            );
            window.location.replace("../member/login.html");
            break;
          case "auth/weak-password":
            window.alert("비밀번호는 6자리 이상으로 변경해주세요.");
            break;
        }
      });
  });
});
// });
