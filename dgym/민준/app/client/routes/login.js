import { AuthService } from "../service/authService.js";
const authService = new AuthService();
$("#login_btn").click(() => {
  const email = $("#mem_email").val();
  const pw = $("#mem_pw").val();
  authService.EmailLogin(email, pw);
});
// 회원가입
$("#register_btn").click(() => {
  window.location.href = "./register.html";
});
// 구글로그인
$("#googlelogin").on("click", () => {
  authService.Login("Google");
});
// 페이스북 로그인
$("#facebooklogin").on("click", () => {
  authService.Login("Facebook");
});
// 깃헙 로그인
$("#githublogin").on("click", () => {
  authService.Login("Github");
});
