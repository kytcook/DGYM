// 모달창 드래그로 움직이게 하기
$(function () {
  $(".modal-dialog").draggable({
    handle: ".modal-header",
  });
});

//강사관리 페이지 진입 시, db에서 데이터 불러와 화면에 띄우기
const db = firebase.firestore();
db.collection("instructor")
  .orderBy("date", "asc")
  .get()
  .then((snapshot) => {
    console.log(snapshot);
    snapshot.forEach((item) => {
      const data = item.data();
      const template = `
                        <div class="col-lg-5 d-flex mt-5 ms-5">
                        <img
                        class="rounded-circle"
                        src="${data.image}"
                        width="210"
                        height="210"
                        alt="강사사진"
                        />
                      <div
                        class="ms-4 pe-5"
                        style="
                          background-color: rgb(243, 218, 218);
                          border-radius: 5%;
                        ">
                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="name"
                            style="font-weight: bolder"
                            >이름 :</label
                          >
                          <p class="mb-1 ms-1" id="pname" style="font-size: 1.2rem">${data.p_name}</p>
                        </div>

                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="age"
                            style="font-weight: bolder"
                            >나이 :</label
                          >
                          <p class="mb-1 ms-1" style="font-size: 1.2rem">${data.p_age}</p>
                        </div>

                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="category"
                            style="font-weight: bolder"
                            >종목 :</label
                          >
                          <p class="mb-1 ms-1" style="font-size: 1.2rem">${data.p_category}</p>
                        </div>

                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="career"
                            style="font-weight: bolder"
                            >경력 :</label
                          >
                          <p class="mb-1 ms-1" style="font-size: 1.2rem">${data.p_career}</p>
                        </div>

                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="working-day"
                            style="font-weight: bolder"
                            >근무요일 :</label
                          >
                          <p class="mb-1 ms-1" style="font-size: 1.2rem">
                            ${data.p_workday}
                          </p>
                        </div>

                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="working-time"
                            style="font-weight: bolder"
                            >근무시간 :</label
                          >
                          <p class="mb-1 ms-1" style="font-size: 1.2rem">
                            ${data.p_worktime1} ~ ${data.p_worktime2}
                          </p>
                        </div>

                        <div class="d-flex ms-2">
                          <label
                            class="form-label"
                            for="student"
                            style="font-weight: bolder"
                            >수강생 :
                          </label>
                          <p class="mb-2 ms-1" style="font-size: 1.2rem">${data.p_student}</p>
                        </div>

                        <div class="d-flex ms-2">
                        <label
                          class="form-label"
                          for="student"
                          style="font-weight: bolder"
                          >월급 :
                        </label>
                        <p class="mb-2 ms-1" style="font-size: 1.2rem">${data.p_salary}</p>
                      </div>

                        <div class="container">
                              <button class="btn-modal ms-5 m-2"
                                      id="modybutton"
                                      type="button"><a
                                      class="text-decoration-none"
                                      style="color: black"
                                      data-bs-toggle="modal"
                                      href="../views/insModify.html?id=${item.id}">
                                      수정하기</a></button>
                        </div>
                      </div>
                    </div>
                    `;
      $(".box").append(template);
      console.log(item.id);
    });
  });
// sort 컬렉션에 저장하기 위해 분기하는 함수
function sortIns(p_category) {
  if (p_category == "헬스") {
    return "health";
  } else if (p_category == "필라테스") {
    return "pilates";
  } else return "crosfit";
}

//file upload
//버튼 클릭 시 function 실행
document.querySelector("#add_inst").addEventListener("click", () => {
  const db = firebase.firestore();
  const storage = firebase.storage();
  //강사등록 모달 페이지 내 '등록하기' 버튼 클릭 시 입력한 신규 정보 db에 추가하기
  const p_name = $("#i_name").val();
  const p_age = $("#i_age").val();
  const p_category = $("#i_category").val();
  const p_career = $("#i_career").val();
  const p_workday = $("#i_workday").val();
  const p_worktime1 = $("#i_worktime1").val();
  const p_worktime2 = $("#i_worktime2").val();
  const p_student = $("#i_student").val();
  const p_salary = $("#i_salary").val();
  const image = $("#file-select").val();
  const sort = sortIns(p_category);

  //파일 업로드 관련
  if (image !== "") {
    //사용자가 이미지를 선택했을 경우
    const selectedFile = document.querySelector("#file-select").files[0];
    const storageRef = storage.ref();
    const storagePath = storageRef.child("image/" + selectedFile.name);
    const uploadImg = storagePath.put(selectedFile);
    uploadImg.on(
      "state_change",
      null,
      (error) => {
        if (error) console.error(error);
      },
      //성공 시 동작하는 함수
      function () {
        db.collection("sort")
          .doc(sort)
          .get()
          .then((doc) => {
            insNum = doc.data().instructor;
            addInsNum(insNum);
          });
        function addInsNum(insNum) {
          db.collection("sort")
            .doc(sort)
            .update({
              instructor: insNum + 1,
            });
        }
        console.log("사용자가 선택한 이미지 파일 ===> " + selectedFile.name);
        uploadImg.snapshot.ref.getDownloadURL().then((url) => {
          //snapshot.ref.getDownloadURL() ==> url을 가져오기 위해서 사용하는 메서드
          const toSave = {
            p_name,
            p_age,
            p_category,
            p_career,
            p_workday,
            p_worktime1,
            p_worktime2,
            p_student,
            p_salary,
            date: new Date(),
            image: url, //업로드에 성공한 이미지 url 담기
          };
          db.collection("instructor")
            .add(toSave)
            .then(() => {
              console.log("image 저장 성공");
              location.reload(); //데이터 추가 후 페이지 새로고침 처리
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    );
  } else {
    //사용자가 이미지를 선택하지 않은 경우 ==> 기본 이미지로 저장됨
    console.log("사용자가 이미지파일을 선택하지 않았음");
    const toSave = {
      p_name,
      p_age,
      p_category,
      p_career,
      p_workday,
      p_worktime1,
      p_worktime2,
      p_student,
      p_salary,
      date: new Date(),
      image:
        "https://firebasestorage.googleapis.com/v0/b/d-gym-demo.appspot.com/o/image%2Fdefault_img.png?alt=media&token=9abc6848-2417-4ab9-a321-3a5bd229fee4",
    };
    db.collection("instructor")
      .add(toSave)
      .then(() => {
        location.reload(); //데이터 추가 후 페이지 새로고침 처리
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
