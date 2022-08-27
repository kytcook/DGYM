// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
window.onload = checkLogin;
function checkLogin() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const db = firebase.firestore();
      const userInfo = {
        mem_email: user.email,
        mem_hp: user.phoneNumber,
      };
      // 문서에 user.uid에 해당하는 문서가 없는 소셜회원은 회원가입
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return;
          } else {
            alert("소셜 회원님 가입을 축하드립니다😍");
            db.collection("user").doc(user.uid).set(userInfo);
          }
        });
      const login = document.querySelector("#login");
      login.textContent = "logout";
      login.id = "logout";
      login.addEventListener("click", logout);
      login.classList.add("btn-danger");
      // 마이페이지
      const div = document.querySelector(".btn-group");
      const mypage = document.createElement("a");
      let userName = null;
      mypage.setAttribute("href", "/client/views/mypage/membership.html");
      user.displayName != null
        ? (userName = user.displayName)
        : (userName = "익명회원");
      mypage.innerHTML = `
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                id="mypage"
              >${userName}님
              </button>
      `;

      div.appendChild(mypage);
      return user;
    }
  });
}

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
