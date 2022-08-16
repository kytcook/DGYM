// 화면이 렌더링 되는 것과 스크립트 처리 사이에 시간차
window.onload = function () {
  $(document).ready(function () {
    const db = firebase.firestore();
    let params = new URLSearchParams(document.location.search);
    let id = params.get("id");
    console.log("사용자가 선택한 item.id ===> " + id);
    $("#staticBackdrop").modal("show");
    const readModal = document.getElementById("staticBackdrop");
    console.log(readModal);
    readModal.addEventListener("shown.bs.modal", () => {
      db.collection("instructor")
        .doc(id)
        .get()
        .then((result) => {
          const name = result.data().p_name;
          const age = result.data().p_age;
          const category = result.data().p_category;
          const career = result.data().p_career;
          const workday = result.data().p_workday;
          const worktime1 = result.data().p_worktime1;
          const worktime2 = result.data().p_worktime2;
          const student = result.data().p_student;
          const salary = result.data().p_salary;
          console.log(result.data());
          $("#name").attr("value", name);
          $("#age").attr("value", age);
          $("#category").attr("value", category);
          $("#career").attr("value", career);
          $("#workday").attr("value", workday);
          $("#worktime1").attr("value", worktime1);
          $("#worktime2").attr("value", worktime2);
          $("#student").attr("value", student);
          $("#salary").attr("value", salary);
        });
    });
  });
};

//수정 후 저장 버튼 클릭 시 변경된 정보값 읽어 db에 update 후, 페이지 이동
$(document).ready(function () {
  $("#save").click(function () {
    const db = firebase.firestore();
    let params = new URLSearchParams(document.location.search);
    let id = params.get("id");

    const p_name = $("#name").val();
    const p_age = $("#age").val();
    const p_category = $("#category").val();
    const p_career = $("#career").val();
    const p_workday = $("#workday").val();
    const p_worktime1 = $("#worktime1").val();
    const p_worktime2 = $("#worktime2").val();
    const p_student = $("#student").val();
    const p_salary = $("#salary").val();

    //파일 업로드 관련
    // files[0]은 querySelector로 선택된 파일에 접근할 수 있도록
    const selectedFile = document.querySelector("#ins_img").files[0];
    const storageRef = storage.ref();
    const storagePath = storageRef.child("image/" + selectedFile.name);
    const uploadImg = storagePath.put(selectedFile);
    uploadImg.on(
      "state_change",
      null,
      (error) => {
        console.error(error);
      },
      function () {
        uploadImg.snapshot.ref.getDownloadURL().then((url) => {
          console.log("사용자가 선택한 이미지 파일 ===> " + selectedFile.name);

          db.collection("instructor")
            .doc(id)
            .update({
              p_name: p_name,
              p_age: p_age,
              p_category: p_category,
              p_career: p_career,
              p_workday: p_workday,
              p_worktime1: p_worktime1,
              p_worktime2: p_worktime2,
              p_student: p_student,
              p_salary: p_salary,
              modi_date: new Date(),
              image: url, //업로드에 성공한 이미지 url 담기
            })
            .then(() => {
              window.location.href = "instructor.html";
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    );
  });
});

//삭제 버튼 클릭 시, 데이터 삭제 후 페이지 이동
$("#delete").click(function () {
  console.log("데이터 삭제 버튼 클릭");
  const ok = window.confirm("해당 강사의 데이터를 삭제하시겠습니까?");
  const db = firebase.firestore();
  let params = new URLSearchParams(document.location.search);
  let id = params.get("id");
  if (ok) {
    db.collection("instructor")
      .doc(id)
      .delete()
      .then(() => {
        console.log("데이터 삭제 성공");
        window.location.href = "instructor.html";
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
