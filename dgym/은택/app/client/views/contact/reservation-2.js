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

  const info = [
    (이름 = $("#name").val()),
    (성별 = $("#gender").val()),
    (연락처 =
      $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val()),
    (프로그램 = $("#program").val()),
    (등록날짜 = year + "-" + month + "-" + date),
    (예약날짜 = $("#time").val()) /* =(html)희망날짜 */,
    (문의유형 = $("#question").val()),
    (희망강사 = $("#teacher").val()),
  ];

  if (info !== (null || "")) {
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
        console.log(info);
        alert("접수가 완료 되었습니다.");
        window.location.replace("./reservation.html");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  } else {
    alert("빈 칸을 채워주세요");
  }
});
/*===============  추가 End ===============*/
