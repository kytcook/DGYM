/*===============  추가 Start ===============*/
const db = firebase.firestore();
//사용자가 입력한 이메일, 비번, 핸폰번호, 이름
$("#submit").click(function () {
  /* 현재날짜 */
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let date = ("0" + today.getDate()).slice(-2);
  console.log(year + "-" + month + "-" + date);
  // document.write(year + "-" + month + "-" + date);
  /* 현재날짜 */

  const 이름 = $("#name").val();
  const 성별 = $("#gender").val();
  const 연락처 =
    $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
  const 프로그램 = $("#program").val();
  const 등록날짜 = year + "-" + month + "-" + date;
  const 예약날짜 = $("#time").val(); /* =(html)희망날짜 */
  const 문의유형 = $("#question").val();
  const 희망강사 = $("#teacher").val();
  db.collection("enquire")
    .add({
      이름,
      성별,
      연락처,
      프로그램,
      등록날짜,
      예약날짜,
      문의유형,
      희망강사,
    })
    .then(() => {
      console.log("입력 성공");
      window.location.href = "./reservaion.html";
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
});
/*===============  추가 End ===============*/
