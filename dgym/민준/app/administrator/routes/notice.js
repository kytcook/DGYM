const db = firebase.firestore();
// 페이징 처리
let params = new URL(document.location).searchParams;
let page = params.get("page");
let num = 0; // 페이지 순번 담음
let numPerPage = 5; // 한페이지에 몇개씩 뿌릴건가
// 로드 될 때 page 1에 해당하는 것만 불러와
// page 2에 해당하는 것만 불러와라
let startPage = page - ((page - 1) % numPerPage);
let lastPage = 0;
console.log(`시작페이지는 ${startPage}페이지 입니다`); // 시작페이지
// Database에서 데이터 가져오기
db.collection("board")
  .orderBy("작성일", "desc")
  .get()
  .then((snapshot) => {
    let lastItemNum = snapshot.docs.length;
    console.log("총 데이터 건수는 " + lastItemNum + " 입니다");
    for (let i = page * numPerPage; i < page * numPerPage + numPerPage; i++) {
      num = i - numPerPage;
      console.log(num);
      if (lastItemNum === i - numPerPage) break;
      const templete = `
                <tr>
                  <th scope="row" class="text-center ">${++num}</th>
                  <td class="text-center"><a href="./detailNotice.html?id=${
                    snapshot.docs[i - numPerPage].id
                  }" style="text-decoration: none; color:black;" >
                    ${snapshot.docs[i - numPerPage].data().제목}</a></td>
                  <td class="text-center">${
                    snapshot.docs[i - numPerPage].data().작성자
                  }</td>
                  <td class="text-center">${
                    snapshot.docs[i - numPerPage].data().작성일
                  }</td>
                </tr>
                    `;
      $(".board-content").append(templete); // 데이터가 저장된 만큼 찍힌다.
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

// 글등록하기 이벤트
$("#insert").on("click", () => {
  let today = new Date();
  let year = String(today.getFullYear()).padStart(2, "0");
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let date = String(today.getDate()).padStart(2, "0");
  const title = $(".title").val();
  let content = $(".content").val();
  // 개행 처리
  content = content.replace(/(\n|\r\n)/g, "<br>");
  if (title !== "" && content !== "") {
    db.collection("board")
      .add({
        제목: title,
        작성자: "관리자",
        작성일: `${year}-${month}-${date}`,
        내용: content,
      })
      .then((docRef) => {
        alert("글이 등록되었습니다");
        window.location = `./notice.html?page=1`;
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  } else {
    alert("내용을 입력해 주세요");
  }
});

// 취소 이벤트(초기화)
$("#cancel").on("click", () => {
  $(".title").val("");
  $(".content").val("");
});
