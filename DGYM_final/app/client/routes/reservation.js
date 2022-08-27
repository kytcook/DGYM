/*============= 강사연동 Start ============*/
// 현재 로그인된 사용자 대조 api
// console.log(user.uid); // uid가져왔니??
const db = firebase.firestore();
db.collection("instructor")
  .orderBy("p_category", "asc")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      data = doc.data();
      p_name = `<option value=${data.p_name}>${data.p_name}</option>`;
      $("#p_name").append(p_name);
    });
  });
/*============== 강사연동 End =============*/

/*===============  추가 Start ===============*/
//사용자가 입력한 이메일, 비번, 핸폰번호, 이름
$("#submit").click(function () {
  //현재날짜
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let date = ("0" + today.getDate()).slice(-2);

  /* 사용자가 입력한 값 변수에 담기 */
  // 이름, 성별, 연락처, 프로그램, 등록일자, 희망일자, 문의유형, 강사
  const name = $("#name").val();
  const gender = $("#gender").val();
  const phone =
    $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
  const program = $("#program").val();
  const registDate = year + "-" + month + "-" + date; // 등록날짜
  const reservDate = $("#time").val(); /* 예약날짜 = (html)희망날짜 */
  const p_name = $("#p_name").val();

  // is not null
  if (!name || !gender || !phone || !program || !reservDate || !p_name) {
    alert(
      "빈 칸을 채워주세요 \n      /)/)\n    ( -__-)     ∧ ∧    \n~~(>Δ< )  (ㅇㅇ )~~~~\n~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~"
    );
  } else {
    // 파베DB 에 저장
    db.collection("enquire")
      .add({
        name,
        gender,
        phone,
        program,
        registDate,
        reservDate,
        p_name,
      })
      .then(() => {
        alert("접수가 완료 되었습니다.");
        window.location.replace("./reservation.html");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
});
/*===============  추가 End ===============*/
