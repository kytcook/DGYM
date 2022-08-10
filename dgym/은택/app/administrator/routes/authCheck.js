window.onload = checkLogin;
// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
function checkLogin() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
    } else {
      alert("현재 페이지에 접근 권한이 없습니다❗");
      window.location = "/adminLogin";
    }
  });
}
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("로그아웃 처리 되었습니다");
      window.location = "/adminLogin"; //After successful login, user will be redirected to home.html
    })
    .catch((error) => {
      console.log(error);
    });
}
// 로그인 페이지 이동
document.querySelector("#logout").addEventListener("click", () => {
  logout();
});
