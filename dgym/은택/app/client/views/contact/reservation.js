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

  if (
    이름 !== (null || "") ||
    성별 !== (null || "") ||
    연락처 !== (null || "") ||
    프로그램 !== (null || "") ||
    예약날짜 !== (null || "") ||
    문의유형 !== (null || "") ||
    희망강사 !== (null || "")
  ) {
    alert("아 좀 입력좀");
  } else {
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
        alert("접수가 완료 되었습니다.");
        window.location.replace("./reservation.html");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
});
/*===============  추가 End ===============*/
// 페이징 처리
let params = new URL(document.location).searchParams;
let page = params.get("page");
let pnum = 0; // 페이지 순번 담음
let numPerPage = 10; // 한페이지에 몇개씩 뿌릴건가
// 로드 될 때 page 1에 해당하는 것만 불러와
// page 2에 해당하는 것만 불러와라
let startPage = page - ((page - 1) % numPerPage);
let lastPage = 0;
console.log(`시작페이지는 ${startPage}페이지 입니다`); // 시작페이지
// Database에서 데이터 가져오기
db.collection("enquire")
  .orderBy("registDate", "desc")
  .get()
  .then((snapshot) => {
    let lastItemNum = snapshot.docs.length;
    console.log("총 데이터 건수는 " + lastItemNum + " 입니다");
    for (let i = page * numPerPage; i < page * numPerPage + numPerPage; i++) {
      pnum = i - numPerPage;
      console.log(pnum);
      console.log(snapshot.docs.data().name);
      if (lastItemNum === i - numPerPage) break;
      const templete = `
                                  <tr>
                                    <th scope="row" class="text-center ">${++pnum}</th>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data().name
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data()
                                        .gender
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data().phone
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data()
                                        .program
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data()
                                        .registDate
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data()
                                        .reservDate
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data()
                                        .question
                                    }</td>
                                    <td class="text-center">${
                                      snapshot.docs[i - numPerPage].data()
                                        .teacher
                                    }</td>
                                    <td id="${doc.id}" class="bg-white">
                                    <button class="del bg-warning">삭제하기</button></td>
                                  </tr>
              `;
      $(".enquire-article").append(templete); // 데이터가 저장된 만큼 찍힌다.
    }
    lastPage = Math.ceil(lastItemNum / numPerPage);
    console.log(`마지막 페이지는 ${lastPage}페이지 입니다`);
    // lastPageBar함수가 외부에 있으면 시점의 문제로 먼저 수행되어 lastPage가 0으로 찍힌다
    //(페이지 번호 처리)
    for (let i = 0; i < numPerPage; i++) {
      // startPage + i = 현재 페이지
      if (startPage + i <= lastPage) {
        const page = `
            <li class="page-item"><a class="page-link" href="?page=${
              startPage + i
            }">${startPage + i}</a></li>
            `;
        $("#pagination").append(page);
      }
    }
    lastPageBar();
  });
// 이전페이지 판별하는 함수
if (startPage - 1 > 0) {
  $(".pre").attr("href", `?page=${startPage - 1}`);
} else if (startPage - 1 <= 0) {
  $(".pre").on("click", () => {
    alert("이전페이지는 존재하지 않습니다❗");
  });
}
// 마지막 페이지 판별하는 함수
function lastPageBar() {
  if (startPage + numPerPage <= lastPage) {
    // 다음 이동시 마지막 페이지 처리//
    // 현재 15페이지에 있더라도 전역변수 startPage는 12이므로 +3을 해줘야한다
    $(".next").attr("href", `?page=${startPage + numPerPage}`);
  } else if (startPage + numPerPage > lastPage) {
    $(".next").on("click", () => {
      alert("다음페이지는 존재하지 않습니다❗");
    });
  }
}
