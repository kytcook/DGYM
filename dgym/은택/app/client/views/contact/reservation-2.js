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

  const name = $("#name").val();
  const gender = $("#gender").val();
  const phone =
    $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
  const program = $("#program").val();
  const registDate = year + "-" + month + "-" + date; // 등록날짜
  const reservDate = $("#time").val(); /* 예약날짜 = (html)희망날짜 */
  const question = $("#question").val();
  const teacher = $("#teacher").val();

  // 객체로 담아서 보내보기
  // const info = {
  //   이름: $("#name").val(),
  //   성별: $("#gender").val(),
  //   연락처:
  //     $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val(),
  //   프로그램: $("#program").val(),
  // };

  if (
    !name ||
    !gender ||
    !phone ||
    !program ||
    !reservDate ||
    !question ||
    !teacher
  ) {
    alert(
      "빈 칸을 채워주세요 \n      /)/)\n    ( -__-)     ∧ ∧    \n~~(>Δ< )  (ㅇㅇ )~~~~\n~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~"
    );
  } else {
    db.collection("enquire")
      .add({
        name,
        gender,
        phone,
        program,
        registDate,
        reservDate,
        question,
        teacher,
      })
      .then(() => {
        alert("접수가 완료 되었습니다.");
        // window.location.replace("./reservation.html");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
});
/*===============  추가 End ===============*/
