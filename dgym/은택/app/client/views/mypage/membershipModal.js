//모달창 자체 드래그로 움직이게 하기
$(function () {
  $(".modal-dialog").draggable({
    handle: ".modal-header",
  });
});

let docRef = ""; // 클릭한 데이터의 문서 id(전역변수)

//수정하기 버튼 클릭 시 회원 정보 불러오기 ======= @@@@@@@수정필요.@@@@@
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
            const email = result.data().mem_email;
            const hp = result.data().mem_hp;
            const birth = result.data().mem_birth;
            const img = result.data().image;
            // const career = result.data().p_career;
            console.log(result.data());
            $("#mem_name").attr("value", email);
            $("#mem_hp").attr("value", hp);
            $("#mem_birth").attr("value", birth);
            // $("#career").attr("value", career);
          }); ///////end of then

        // $(".modybtn").on("click", (event) => {
        //   const docRef = event.currentTarget.getAttribute("id");
        //   console.log(docRef);
        // });
      }); //////////end of addEventListener
    } //////////////end of if

    /*=============================== 삭제 Start ==================================*/

    document.getElementById("user_delete").addEventListener("click", (e) => {
      // 탈퇴하기가 눌리면 Firestore의 문서를 먼저 삭제합니다.
      const ok = confirm("정말로 삭제하시겠습니까??");
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
                window.location.replace("../../../login.html");
              })
              .catch((error) => {
                console.log(error);
              });
          });
      } else {
        alert("취소되었습니다.");
        console.log("삭제취소함");
      }
    });

    /*================================ 삭제 End ===================================*/
  }); //////////////end of onAuthStateChanged
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
                .then(() => {})
                .then(() => {
                  window.location.href = "membership.html";
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
