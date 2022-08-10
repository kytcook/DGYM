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
      // console.log(user);
      // 마이페이지
      const div = document.querySelector(".btn-group");
      const mypage = document.createElement("a");
      mypage.setAttribute("href", "/client/views/mypage/membership.html");
      mypage.innerHTML = `
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                id="mypage"
              >${user.displayName}님
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
      window.location.replace("../../../index.html"); //After successful login, user will be redirected to home.html
    })
    .catch((error) => {
      console.log(error);
    });
}
// 로그인 페이지 이동
document.querySelector("#login").addEventListener("click", () => {
  window.location = "login.html";
});
