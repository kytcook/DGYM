const db = firebase.firestore();

// 배정강사 동적으로 바인딩
let teacherName = [];
db.collection("instructor")
  .get()
  .then((snapshot) => {
    snapshot.forEach((item) => {
      let pName = item.data().p_name;
      teacherName.push(pName);
    });
  })
  .then(() => {
    const select = $("#teacher");
    teacherName.forEach((item, i) => {
      const template2 = `
          <option value="${i + 2}">${item}</option>
    `;
      select.append(template2);
    });
  });

$("#btnInsert").click(() => {
  if (nullCheck()) {
    memInsert();
  } else {
    alert("값을 모두 입력하세요.");
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
    sort = "health";
    return 300000;
  } else if (membership == "pt30회") {
    sort = "health";
    return 600000;
  } else if (membership == "필라테스3개월") {
    sort = "pilates";
    return 400000;
  } else if (membership == "크로스핏3개월") {
    sort = "crossfit";
    return 450000;
  }
}

// 운동 분류
// 사용자 입력값 db에 저장하는 함수
let sort = null;
function memInsert() {
  const name = $("#name").val();
  const age = $("#age").val();
  const phone = $("#phone").val();
  const regDate = $("#date").val();
  const membership = $("#membership option:selected").text();
  const payment = $("#payment option:selected").text();
  const teacher = $("#teacher option:selected").text();
  const price = membershipPrice();
  let memNum = 0;
  console.log(price);
  console.log(sort);

  console.log(price);
  db.collection("sort")
    .doc("corssfit")
    .get()
    .then((doc) => {});

  function addMemNum(memNum) {
    db.collection("sort")
      .doc(sort)
      .update({
        member: memNum + 1,
      });
  }
  //멤버 등록시 sort컬렉션에 헬스 or 크로스핏 or 필라테스 멤버 +1 (대시보드에서 사용)
  db.collection("sort")
    .doc(sort)
    .get()
    .then((doc) => {
      memNum = doc.data().member;
      addMemNum(memNum);
    });
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
