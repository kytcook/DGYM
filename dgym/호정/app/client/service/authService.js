// 소셜 로그인 및 이메일 로그인
class AuthService {
  // 각 소셜 provider 주입
  constructor() {
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.facebookProvider = new firebase.auth.FacebookAuthProvider();
    this.githubProvider = new firebase.auth.GithubAuthProvider();
  }
  // 삼항연산자로 각 소셜 provider 분기
  Login(providerName) {
    let authProvider = null;
    providerName == "Google"
      ? (authProvider = this.googleProvider)
      : providerName == "Facebook"
      ? (authProvider = this.facebookProvider)
      : (authProvider = this.githubProvider);
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then((result) => {
        window.location.href = "./index.html";
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  // 이메일 로그인
  EmailLogin(mem_email, mem_pw) {
    firebase
      .auth()
      .signInWithEmailAndPassword(mem_email, mem_pw)
      .then((result) => {
        console.log(result.user);
        window.location.replace("../../../index.html");
      })
      .catch((error) => {
        window.alert("없는 회원입니다. 다시 확인하세요");
      });
  }
}
export { AuthService };
