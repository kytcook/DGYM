window.onload = checkLogin;
// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
function checkLogin() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const login = document.querySelector("#login");
      login.textContent = "logout";
      login.id = "logout";
      login.addEventListener("click", logout);
      login.classList.add("btn-danger");
      console.log(user);
      document.querySelector("#mypage").innerHTML = user.displayName + "님";
      document.querySelector(".btn-group").classList.add("col-2");
      document.querySelector(
        ".card-title"
      ).innerHTML = `이름 : ${user.displayName}`;
      document.querySelector(
        ".card-text1"
      ).innerHTML = `이메일 : ${user.email}`;
      document.querySelector(
        ".card-text2"
      ).innerHTML = `휴대폰 : ${user.email}`;

      const db = firebase.firestore();
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          document.querySelector(".card-text2").innerHTML = `휴대폰 : ${
            snapshot.data().mem_hp
          }`;
        });

      // db.collection('user').get().then((snapshot)=>{
      //  //snapshot은 배열이다
      // snapshot.forEach((item)=>{
      // if(item.data().mem_email === user.email){
      // }
      // console.log(item.data().mem_email);
      //   })
      // })
    } else {
      document.querySelector("#mypage").style.display = "none";
    }
  });
}
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("로그아웃 처리 되었습니다");
      window.location = "index.html"; //After successful login, user will be redirected to home.html
    })
    .catch((error) => {
      console.log(error);
    });
}
// 로그인 페이지 이동
document.querySelector("#login").addEventListener("click", () => {
  window.location = "login.html";
});
