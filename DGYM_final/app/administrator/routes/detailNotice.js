const db = firebase.firestore();
$(document).ready(function () {
  let params = new URLSearchParams(document.location.search);
  let id = params.get("id"); // 파라미터 이름에 해당하는 값을 얻는다
  db.collection("board")
    .get()
    .then((snapshot) => {
      snapshot.forEach((item) => {
        if (item.id === id) {
          const title = item.data().제목;
          const writer = item.data().작성자;
          const regdate = item.data().작성일;
          const content = item.data().내용;
          $("#title").html(`<strong>${title}</strong>`);
          $("#writer").html(`작성자: ${writer}`);
          $("#regdate").html(`등록일: ${regdate}`);
          $("#content").html(`${content}`);
        }
      });
    });
});

// 수정 클릭시
$(".btn-primary").on("click", () => {
  const title = $("#title").text();
  let content = $("#content").text();
  $(".btn-group").html(
    `
          <button class="btn btn-success" onclick="update()">수정 완료</button>
          `
  );
  $("#form-title").html(
    `<div">
            <label>제목:</label>
              <input value="${title}" style="width:20em;" class="title"></input>
          </div>
        `
  );
  $("#form-content").html(
    `<div class="form-floating">
              <textarea class="form-control content" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 300px">${content}</textarea>
              <label for="floatingTextarea2">Content</label>
            </div>
          `
  );
});
// 업데이트 함수(최종 수정완료)
function update() {
  // 작성일을 위한 날짜 변수
  let today = new Date();
  let year = String(today.getFullYear()).padStart(2, "0");
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let date = String(today.getDate()).padStart(2, "0");
  // 현재 글 id 구하기
  let params = new URLSearchParams(document.location.search);
  console.log(params);
  console.log(month);
  let id = params.get("id"); // 파라미터 이름에 해당하는 값을 얻는다
  db.collection("board")
    .get()
    .then((snapshot) => {
      snapshot.forEach((item) => {
        if (item.id === id) {
        }
      });
    });
  const boardRef = db.collection("board").doc(id);
  let content = $(".content").val();
  content = content.replace(/(\n|\r\n)/g, "<br>");
  return boardRef
    .update({
      제목: $(".title").val(),
      내용: content,
      작성일: `${year}-${month}-${date}`,
    })
    .then(() => {
      alert("수정이 완료 되었습니다^o^");
      window.location = `./notice.html?page=1`;
    })
    .catch((error) => {
      console.error("수정 중 오류발생: ", error);
    });
}
// 데이터 삭제
$(".btn-danger").on("click", () => {
  let params = new URLSearchParams(document.location.search);
  let id = params.get("id"); // 파라미터 이름에 해당하는 값을 얻는다
  db.collection("board")
    .doc(id)
    .delete()
    .then(() => {
      console.log("게시글이 삭제되었습니다❗");
      window.location = `./notice.html?page=1`;
    })
    .catch((error) => {
      console.error("게시글 삭제중 오류 ", error);
    });
});
