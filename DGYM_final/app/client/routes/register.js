const db = firebase.firestore();
$("#register").click(() => {
  const mem_name = $("#mem_name").val();
  const mem_email = $("#mem_email").val();
  const mem_hp = $("#mem_hp").val();
  const mem_pw = $("#mem_pw").val();
  const mem_pwCheck = $("#mem_pwCheck").val();
  if (nullCheck(mem_name, mem_email, mem_hp, mem_pw, mem_pwCheck)) {
    if (mem_pw == mem_pwCheck) {
      if (mem_pw.length >= 6) {
        register();
      } else {
        alert("비밀번호 6자리 이상 입력하세요❗");
      }
    } else {
      alert("비밀번호가 다릅니다❗");
    }
  } else alert("모든 항목을 입력하세요❗");

  // 회원가입 메소드
  function register() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(mem_email, mem_pw)
      .then((result) => {
        console.log(result.user);
        const userInfo = {
          mem_email: mem_email,
          mem_hp: mem_hp,
        };
        db.collection("user").doc(result.user.uid).set(userInfo);
        return result.user
          .updateProfile({
            displayName: mem_name,
          })
          .then((displayName) => {
            console.log("displayName => " + mem_name);
            alert("회원가입을 축하합니다👏");
            window.location.href = "./login.html";
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// 유효성 체크
function nullCheck(name, email, hp, pw, _pw) {
  if (name == "" || email == "" || hp == "" || pw == "" || _pw == "") {
    return false;
  } else return true;
}

// 이메일 중복체크
$("#emailCheckBtn").click(() => {
  const mem_email = $("#mem_email").val();
  console.log(mem_email);
  db.collection("user")
    .get()
    .then((snapshot) => {
      let isOk = true;
      snapshot.forEach((item) => {
        if (mem_email == item.data().mem_email) {
          isOk = false;
        }
      });
      if (isOk) {
        alert("사용 가능합니다");
        // 가입하기 버튼 활성화
        $("#register").attr("disabled", false);
        $("#mem_email").attr("disabled", true);
        $("#mem_email").css("background-color", "rgb(132, 137, 143)");
      } else alert("이미 사용중인 이메일입니다");
    });
});
