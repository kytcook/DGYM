const db = firebase.firestore();

$(document).ready(function () {
  let params = new URLSearchParams(document.location.search);
  console.log(params);
  let id = params.get("id"); // 파라미터 이름에 해당하는 값을 얻는다
  console.log("사용자가 선택한 item.id" + id); // 여기서의 id는 board컬렉션에 해당 게시물 id를 가리킨다
  db.collection("board")
    .get()
    .then((snapshot) => {
      snapshot.forEach((item) => {
        if (item.id === id) {
          const title = item.data().제목;
          const writer = item.data().작성자;
          const regdate = item.data().작성일;
          let content = item.data().내용;
          content = content.replace(/(\n|\r\n)/g, "<br>");
          $("#title").html(`${title}`);
          $("#writer").html(`${writer} &nbsp; | &nbsp;`);
          $("#regdate").html(` ${regdate}`);
          $("#content").html(`${content}`);
        }
      });
    });
});
