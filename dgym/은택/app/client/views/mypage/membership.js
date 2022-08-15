/*=============== 삭제 Start ==============*/
const user = firebase.auth().currentUser;
document.getElementById("user_delete").addEventListener("click", (e) => {
  user.delete();
  //       (() => {
  //         alert('회원탈퇴되었습니다.');
  //         window.location = ".login.html"
  //       }).catch((error) => {
  //         console.log(error);
  //       });
});
// /*================ 삭제 End ===============*/
