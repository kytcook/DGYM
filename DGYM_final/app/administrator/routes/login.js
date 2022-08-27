$("#login_btn").click(() => {
  const mem_email = $("#admin_id").val();
  const mem_pw = $("#admin_pw").val();
  firebase
    .auth()
    .signInWithEmailAndPassword(mem_email, mem_pw)
    .then((result) => {
      window.location = "./adminHome.html";
    })
    .catch((error) => {
      window.alert("다시 확인하세요.");
    });
});
