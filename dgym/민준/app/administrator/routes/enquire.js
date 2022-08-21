/*============= 가져오기 Start ============*/
const db = firebase.firestore();
let num = 0; //
db.collection("enquire")
  .orderBy("registDate", "asc") //오름차순 정렬
  .get()
  .then((snapshot) => {
    console.log(snapshot);
    snapshot.forEach((doc) => {
      console.log(doc);
      // doc -> item
      // console.log(item.data());
      const data = doc.data(); // doc.data() -> data
      const template = `
                      <tr class = "table-secondary">
                        <th scope="row" class="table-primary">${++num}</th>
                        <th>${data.name}</th>
                        <td>${data.gender}</td>
                        <td>${data.phone}</td>
                        <td>${data.program}</td>
                        <td>${data.registDate}</td>
                        <th class="table-danger">${data.reservDate}</th>
                        <td>${data.p_name}</td>
                        <td id="${doc.id}" class="bg-white">
                          <button class="del bg-warning">삭제하기</button></td>
                          </tr>
                          `;
      // <th>${data.userInfo}</th>
      $(".enquire-article").append(template); // tbody에 fireStore에서 불러온 값들을 붙여준다
    });
    /*============== 가져오기 End =============*/

    /*=============== 삭제 Start ==============*/
    const deletebtn = document.querySelectorAll(".del"); // 클래스명이 del인 버튼(207)을 상수에 저장
    $(document).ready(function () {
      // $(deletebtn).click(function (e) {  }); // 사용시 : forEach삭제
      deletebtn.forEach((deletebtn) => {
        // 버튼 클릭, 삭제
        deletebtn.addEventListener("click", (e) => {
          e.stopPropagation(); // 이벤트가 발생한 상태에서 다른 이벤트나 움직임을 강제로 멈추는 기능
          let id = e.target.parentElement.getAttribute("id"); // 이벤트발생시 id가 가진 속성의 부모요소를 타게팅하여 변수에 저장
          db.collection("enquire") // enquire문서에서, 위에서 담은 변수 id 삭제
            .doc(id)
            .delete()
            .then(() => {
              console.log("Document successfully deleted!");
              location.reload(); // 삭제성공 -> 새로고침
              // window.location.href = "./enquire_1-4f.html";
            })
            .catch((error) => {
              console.error("Error removing document: ", error);
            });
        });
      });
    });
    /*================ 삭제 End ===============*/
  });

// querySelectorAll을 이벤트리스너에서 사용하기 위해서는 반복문을 통해 모든요소에 추가시켜야 한다.
