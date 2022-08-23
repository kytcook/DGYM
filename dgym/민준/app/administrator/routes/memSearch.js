$(document).ready(searchTotalList());

const db = firebase.firestore();
let docRef = ""; // 클릭한 데이터의 문서 id(전역변수)
// 전체 회원 조회 함수

function searchTotalList() {
  $("#memberContent").empty(); // content의 하위태그 모두 삭제(초기화)
  const db = firebase.firestore();
  db.collection("member")
    .orderBy("firstRegDate", "desc")
    .get()
    .then((snapshot) => {
      const memTotal = snapshot.docs.length; // 총 횐원수
      $("#totalTitle").text(`D-GYM의 총 회원수는 ${memTotal}명 입니다`);
      snapshot.forEach((item) => {
        const templete = `
            <tr>
              <td class="text-center">
                <button
                  button
                  type="button"
                  class="btn-detail"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  id="${item.id}" style="border:none";>${
          item.data().name
        }</button></td>
            <td class="text-center" >${item.data().age}</td>
            <td class="text-center" id="mem_phone">${item.data().phone}</td>
            <td class="text-center">${item.data().firstRegDate}</td>
          </tr>
            `;
        $("#memberContent").append(templete); // 데이터가 저장된 만큼 찍힌다.
      });
      // 회원 상세조회 이벤트
      $(".btn-detail").on("click", (event) => {
        docRef = event.currentTarget.getAttribute("id");
        console.log(docRef);
        paymentSearch(docRef);
      });
    });
}

// 결제내역 조회
function paymentSearch(docRef) {
  $(".modal-card").remove(); // 초기화
  /*  modal-title 클릭된 회원이름에 맞게 작성 */
  db.collection("member")
    .doc(docRef)
    .get()
    .then((doc) => {
      $(".modal-title").text(`${doc.data().name}님의 결제내역`);
    });
  /* modal-body 결제내역 정보 */
  db.collection("member")
    .doc(docRef)
    .collection("payment")
    .orderBy("regDate", "desc") //최근 결제 내역부터 정렬
    .get()
    .then((snapshot) => {
      const $div = $(`<div>`);
      snapshot.forEach((item) => {
        const templete = `
                  <div class="card modal-card mb-3">
                    <div class="card-body">
                      <h5 class="card-title">${item.data().regDate}</h5>
                      <span>멤버십: </span>
                      <span class="card-text">${item.data().membership}</span>
                      <br/>
                      <span>결제금액: </span>
                      <span class="card-text">${item.data().price}</span>
                      <br/>
                      <span>결제수단: </span>
                      <span class="card-text">${item.data().payment}</span>
                      <br/>
                      <span>배정강사: </span>
                      <span class="card-text">${item.data().teacher}</span>
                    </div>
                  </div>
                  `;
        $div.append(templete);
      });
      $(".modal-body").append($div);
    });
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
function searchTeacher() {
  let teacherName = [];
  let template1 = `
    <option value="" disabled selected>배정강사</option>
    <option value="1">없음</option>
  `;
  let template2 = ``;
  db.collection("instructor")
    .get()
    .then((snapshot) => {
      snapshot.forEach((item) => {
        let pName = item.data().p_name;
        teacherName.push(pName);
      });
    })
    .then(() => {
      for (let i = 0; i < teacherName.length; i++) {
        template2 = `
          <option value="${i + 2}">${teacherName[i]}</option>
    `;
        template1 += template2;
      }
      $("#teacher").append(template1);
    });
}

// 재등록 이벤트
$("#btn-insert").click(() => {
  $(".card-wrap").css("display", "block");
  $("#teacher").empty();
  searchTeacher();
});
// 추가하기 이벤트
$("#btn-paymentAdd").click(() => {
  const regDate = $("#regDate").val();
  const membership = $("#membership option:selected").text();
  const teacher = $("#teacher option:selected").text();
  const payment = $("#payment option:selected").text();
  const price = membershipPrice();
  db.collection("member").doc(docRef).collection("payment").add({
    regDate: regDate,
    membership: membership,
    price: price,
    teacher: teacher,
    payment: payment,
  });
  $(".card-wrap").css("display", "none");
  alert("등록이 완료되었습니다^o^");
  paymentSearch(docRef);
});

// 재등록 visible 초기화
$("#btn-cancel").click(() => {
  $(".card-wrap").css("display", "none");
});

// 조건검색
function searchList() {
  const choice = $("#gubun option:selected").val();
  const user = $("#keyword").val();
  // 조건이 선택되고 값이 있을 때만 검색허용
  if ($("#gubun > option:selected").val() && !(user == "")) {
    db.collection("member")
      .where(choice, "==", user)
      .get()
      .then((snapshot) => {
        $("#memberContent").empty(); // content의 하위태그 모두 삭제(초기화)
        snapshot.forEach((item) => {
          const templete = `
            <tr>
              <td class="text-center">
                <button
                  type="button"
                  class="btn-detail"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  id="${item.id}" style="border:none";>${
            item.data().name
          }</button></td>
                <td class="text-center" >${item.data().age}</td>
                <td class="text-center" id="mem_phone">${item.data().phone}</td>
                <td class="text-center">${item.data().teacher}</td>
              </tr>
                `;
          $("#memberContent").append(templete); // 데이터가 저장된 만큼 찍힌다.
        });
        $(".btn-detail").on("click", (event) => {
          const docRef = event.currentTarget.getAttribute("id");
          console.log(docRef);
          paymentSearch(docRef);
        });
      });
  } else alert("조건분류 선택 및 검색어를 입력하세요");
}
