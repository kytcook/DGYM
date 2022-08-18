$("#btnInsert").click(() => {
  if (nullCheck()) {
    // console.log("빈값은 없습니다");
    memInsert();
  } else {
    console.log("값을 모두 입력하세요");
  }
});

// 유효성 체크함수
function nullCheck() {
  if (
    $("#name").val() == "" ||
    $("#age").val() == "" ||
    $("#phone").val() == "" ||
    $("#date").val() == "" ||
    !$("#membership > option:selected").val() ||
    !$("#payment > option:selected").val() ||
    !$("#teacher > option:selected").val()
  ) {
    return false;
  } else return true;
}

function membershipPrice() {
  const membership = $("#membership option:selected").text();
  if (membership == "헬스3개월") {
    return 300000;
  } else if (membership == "pt30회") {
    return 600000;
  } else if (membership == "필라테스3개월") {
    return 400000;
  } else if (membership == "크로스핏3개월") {
    return 450000;
  }
}

// 사용자 입력값 db에 저장하는 함수
function memInsert() {
  const db = firebase.firestore();
  const name = $("#name").val();
  const age = $("#age").val();
  const phone = $("#phone").val();
  const regDate = $("#date").val();
  const membership = $("#membership option:selected").text();
  const payment = $("#payment option:selected").text();
  const teacher = $("#teacher option:selected").text();
  const price = membershipPrice();

  db.collection("member")
    .add({
      name: name,
      age: age,
      phone: phone,
      firstRegDate: regDate,
    })
    .then((docRef) => {
      db.collection("member")
        .doc(docRef.id)
        .collection("payment")
        .add({
          membership: membership,
          price: price,
          regDate: regDate,
          payment: payment,
          teacher: teacher,
        })
        .then(() => {
          alert("회원 등록이 완료되었습니다");
          window.location = "./memRegister.html";
        });
    });
}
// db조회를 해서 같은 회원이 있을 경우 결제 금액에 대하여
