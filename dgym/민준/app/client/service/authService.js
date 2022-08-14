// 이메일 로그인
function EmailLogin(mem_email, mem_pw) {
  firebase
    .auth()
    .signInWithEmailAndPassword(mem_email, mem_pw)
    .then((result) => {
      console.log(result.user);
      window.location.replace("./index.html"); //?useruid=${result.user.uid}
      // replace써야 로그인 후 로그인 페이지로 이동안됨. replace가 뒤로가기를 막아준다
    })
    .catch((error) => {
      window.alert("없는 회원입니다. 다시 확인하세요");
    });
}
// 구글 로그인
let provider = new firebase.auth.GoogleAuthProvider();
function GoogleLogin() {
  console.log("Login Btn Call");
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      window.location.href = "./index.html";
    })
    .catch((e) => {
      console.log(e);
    });
}
// 페이스북 로그인
let provider2 = new firebase.auth.FacebookAuthProvider();
function FacebookLogin() {
  firebase
    .auth()
    .signInWithPopup(provider2)
    .then((result) => {
      var credential = result.credential;
      // The signed-in user info.
      var user = result.user;
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var accessToken = credential.accessToken;
      window.location.href = "./index.html";
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
}

export default { EmailLogin, GoogleLogin, FacebookLogin };
