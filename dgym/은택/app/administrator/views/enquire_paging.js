    /*============== paging Start =============*/
    
    const db = firebase.firestore();
    // 페이징 처리
    let params = new URL(document.location).searchParams;
    let page = params.get("page");
    let title_ = params.get("title"); // 사용자 전달 제목(검색)
    let title = "title"; // 기본값
    console.log(`현재 페이지는 ${page}페이지 입니다`);

    // 로드 될 때 page 1에 해당하는 것만 불러와
    // page 2에 해당하는 것만 불러와라
    let startPage = page - ((page - 1) % 3);
    let lastPage = 0;
    let lastItemNum = 0;
    console.log(`시작페이지는 ${startPage}페이지 입니다`); // 시작페이지

    // Database에서 데이터 가져오기
    let num = 0;
    db.collection("enquire")
      .orderBy("registDate", "asc")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          lastItemNum++;
          if (data.번호 >= 1 + (page - 1) * 3 && data.번호 <= page * 3) {
            const templete = `
            <tr class = "table-secondary">
                      <th scope="row" class="table-primary">${++num}</th>
                      <th>${data.name}</th>
                      <td>${data.gender}</td>
                      <td>${data.phone}</td>
                      <td>${data.program}</td>
                      <td>${data.registDate}</td>
                      <th class="table-danger">${data.reservDate}</th>
                      <th class="table-danger">${data.question}</th>
                      <td>${data.teacher}</td>
                      <td id="${doc.id}" class="bg-white">
                        <button class="del bg-warning">삭제하기</button></td>
                        </tr>
                  `;
            $(".enquire-article").append(templete); // 데이터가 저장된 만큼 찍힌다.
          }
        });
        lastPage = Math.ceil(lastItemNum / 5);
        console.log(`마지막 페이지는 ${lastPage}페이지 입니다`); // 이전페이지 처리
        // lastPageBar함수가 외부에 있으면 시점의 문제로 먼저 수행되어 lastPage가 0으로 찍힌다
        //(페이지 번호 처리)
        for (let i = 0; i <= 10; i++) {
          // startPage + i = 현재 페이지
          if (startPage + i <= lastPage) {
            const page = `
                <li class="page-item"><a class="page-link" href="?page=${
                  startPage + i
                }">${startPage + i}</a></li>
                `;
            $("#pagination").append(page);
          }
        }
        lastPageBar();
      });
    // 이전페이지 판별하는 함수
    if (startPage - 1 > 0) {
      $(".pre").attr("href", `?page=${startPage - 1}`);
    } else if (startPage - 1 <= 0) {
      $(".pre").on("click", () => {
        alert("이전페이지는 존재하지 않습니다❗");
      });
    }

    // 마지막 페이지 판별하는 함수
    function lastPageBar() {
      if (startPage + 3 <= lastPage) {
        // 다음 이동시 마지막 페이지 처리//
        // 현재 15페이지에 있더라도 전역변수 startPage는 12이므로 +3을 해줘야한다
        $(".next").attr("href", `?page=${startPage + 3}`);
      } else if (startPage + 3 > lastPage) {
        $(".next").on("click", () => {
          alert("다음페이지는 존재하지 않습니다❗");
        });
      }
    }
  /*============== paging End =============*/
