window.onload = checkLogin;

const db = firebase.firestore();

function checkLogin() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const login = document.querySelector("#login");
      login.textContent = "logout";
      login.id = "logout";
      login.addEventListener("click", logout);
      login.classList.add("btn-danger");
      console.log(user);
      // 마이페이지
      const div = document.querySelector(".btn-group");
      const mypage = document.createElement("a");
      let userName = null;
      mypage.setAttribute("href", "/client/views/mypage/membership.html");
      user.displayName != null
        ? (userName = user.displayName)
        : (userName = "깃회원");
      mypage.innerHTML = `
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                id="mypage"
              >${userName}님
              </button>
      `;

      div.appendChild(mypage);
      searchPh(user.uid);
    }
  });
}
// 로그아웃
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("로그아웃 처리 되었습니다");
      window.location.replace("../../../index.html");
    })
    .catch((error) => {
      console.log(error);
    });
}

// 로그인 페이지 이동
document.querySelector("#login").addEventListener("click", () => {
  window.location = "login.html";
});

// user 컬렉션과 member 컬렉션에서 phone번호가 같은 회원이 있으면 결제정보를 보여준다
function searchPh(userUid) {
  db.collection("user")
    .doc(userUid)
    .get()
    .then((snapshot) => {
      console.log(snapshot.data().mem_hp);
      const mem_hp = snapshot.data().mem_hp;
      searchMem(mem_hp);
    });
}

function searchMem(mem_hp) {
  db.collection("member")
    .get()
    .then((snapshot) => {
      snapshot.forEach((item) => {
        if (mem_hp == item.data().phone) {
          console.log(item.id); // 문서
          const docRef = item.id;
          searchPayment(docRef);
        }
      });
    });
}

// 결제내역 조회
function searchPayment(docRef) {
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
