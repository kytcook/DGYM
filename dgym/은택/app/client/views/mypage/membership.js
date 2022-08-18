const db = firebase.firestore();
const storage = firebase.storage();

/*================================ 가져오기 Start =================================*/

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

      /* ※ 전각공백문자가 포함되어 있습니다. ≒ &nbsp */
      const template = `
                            <p>이름   |  ${user.displayName}</p>
                            <p>연락처  |  ${data.mem_hp}</p>
                            <p>이메일  |  ${data.mem_email}</p>
                            <p>이메일  |  ${data.mem_email}</p>
                            <p>생년월일 |  ${
                              data.mem_birth != null ? data.mem_birth : ""
                            }</p>
                            `;
      $("#intro-start").append(template);

      /////////////////////////// 이미지 분기 가져오기 ///////////////////////////
      // 만약 data.image가 없으면
      if (data.image === undefined) {
        console.log("uid url : " + data.image);
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

/*================================= 가져오기 End ==================================*/

// /*=============== 삭제 Start ==============*/
// document.getElementById("user_delete").addEventListener("click", (e) => {
//   // 탈퇴하기가 눌리면 Firestore의 문서를 먼저 삭제합니다.
//   const ok = confirm("정말로 삭제하시겠습니까??");
//   if (ok) {
//     db.collection("user")
//       .doc(user.uid)
//       .delete()
//       .then(() => {
//         console.log("Document successfully deleted!");
//         // 문서삭제가 완료된 후 사용자 Authentication의 id가 삭제됩니다.
//         // user
//         //   .delete()
//         //   .then(() => {
//         //     alert("회원탈퇴 되었습니다. \n이용해주셔서 감사합니다.");
//         //     window.location.replace("../../../login.html");
//         //   })
//         //   .catch((error) => {
//         //     console.log(error);
//         //   });
//       });
//   } else {
//     alert("취소되었습니다.");
//     console.log("삭제취소함");
//   }
// });
// /*================ 삭제 End ===============*/
