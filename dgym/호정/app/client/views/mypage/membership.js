//모달창 자체 드래그로 움직이게 하기
$(function () {
  $(".modal-dialog").draggable({
    handle: ".modal-header",
  });
});

const user = firebase.auth().currentUser;
const db = firebase.firestore();
const storage = firebase.storage();
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
            const name = user.displayName;
            const hp = result.data().mem_hp;
            const birth = result.data().mem_birth;
            // const career = result.data().p_career;
            console.log(result.data());
            $("#mem_name").attr("value", name);
            $("#mem_hp").attr("value", hp);
            $("#mem_birth").attr("value", birth);
            // $("#career").attr("value", career);
          });

        // $(".modybtn").on("click", (event) => {
        //   const docRef = event.currentTarget.getAttribute("id");
        //   console.log(docRef);
        // });
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
