// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
window.onload = checkLogin;

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
