const db = firebase.firestore();
/* <------------------------------------날짜값 상수로 가져오기  시작-------------------------------------------> */
let today = new Date(); //// 결과 : Sat August 19 2022 15:47:29 GMT+0900
let year = today.getFullYear(); // year = 2022
let month = ("0" + (today.getMonth() + 1)).slice(-2); // getMonth() 함수는 0~11을 반환한다 +1 을 해주어야함
let day = ("0" + today.getDate()).slice(-2); // getMonth(), getDate() 함수는 수치 값을 반환==> 2자리를 맞추기 위해서는 "0"을 붙여서 뒤에서 2자리만 잘라서 값을 변환해야 한다.
let todayString = year + "-" + month + "-" + day; // todayString = 2022-08-19
const GetTodayStr = new Date(todayString); //3개월전이랑 비교할 스트링..
const GetTodayStr2 = new Date(todayString); // 6개월전이랑 비교할 스트링..
/* ----------------------------3Months Ago----------------------------------- */
let ago3Str = new Date(GetTodayStr.setMonth(GetTodayStr.getMonth() - 3));
// todayString은 2022-08-17의 형태로 가져와짐.
console.log("오늘날짜-3개월전" + ago3Str); // -3개월이 된채로 표준시, 날짜 초단위로 찍힘
//let ago3 = GetTodayStr;
let ago3Year = ago3Str.getFullYear();
let ago3Month = ("0" + (ago3Str.getMonth() + 1)).slice(-2);
let ago3Day = ("0" + ago3Str.getDate()).slice(-2);
let ago3String = ago3Year + "-" + ago3Month + "-" + ago3Day;
console.log("기준일로부터 3개월전입니다" + ago3String);
/* ----------------------------3Months Ago----------------------------------- */

/* ----------------------------6Months Ago----------------------------------- */
const agoStr6 = new Date(GetTodayStr2.setMonth(GetTodayStr2.getMonth() - 6));
let ago6Year = agoStr6.getFullYear();
console.log(ago6Year);
let ago6Month = ("0" + (agoStr6.getMonth() + 1)).slice(-2);
let ago6Day = ("0" + agoStr6.getDate()).slice(-2);
let ago6String = ago6Year + "-" + ago6Month + "-" + ago6Day;
console.log("기준일로부터 6개월전입니다" + ago6String);

/* ----------------------------6Months Ago----------------------------------- */

/* ----------------------------12Months Ago----------------------------------- */

function getToday() {
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
}

const lastyear = year - 1;
console.log(lastyear);
let ago12String = lastyear + "-" + month + "-" + day;
console.log("기준일로부터 12개월전입니다: " + ago12String);

// 기간 조회버튼 이벤트
$("#selectBtn").on("click", () => {
  // chart 초기화
  $("#myChart").remove();
  searchSales();
});

// 조회 함수
function searchSales() {
  let totalData = 0;
  let healthCash = 0; // 헬스 3,6,12개월 현금 결제 건수
  let healthCard = 0; // 헬스 3,6,12개월 카드 결제 건수
  let healthSales = 0; // 헬스 총 매출금액

  let ptCash = 0;
  let ptCard = 0;
  let ptSales = 0;

  let pilatesCash = 0; // 필라테스 현금 결제 건수
  let pilatesCard = 0; // 필라테스 카드 결제 건수
  let pilatesSales = 0; // 필라테스 총 매출 금액

  let crossfitCash = 0; // 크로스핏 현금 결제 건수
  let crossfitCard = 0; // 크로스핏 카드 결제 건수
  let crossfitSales = 0; // 크로스핏 총 매출 금액
  const priod = $("#period option:selected").text(); // 관리자가 선택한 개월수 -> 3개월 or 6개월 or 1년
  const standardDate = dateCheck(priod);
  console.log(standardDate);
  alert(`${priod} 매출을 조회합니다👀💗`);
  $("tbody").empty();
  db.collection("member")
    .get()
    .then((snapshot) => {
      totalData = snapshot.docs.length;
      for (let i = 0; i < totalData; i++) {
        db.collection("member")
          .doc(snapshot.docs[i].id)
          .collection("payment")
          .get()
          .then((snapshot) => {
            snapshot.forEach((item) => {
              if (
                standardDate < item.data().regDate &&
                item.data().regDate < getToday()
              ) {
                if ("헬스3개월" == item.data().membership) {
                  healthSales += item.data().price;
                  switch (item.data().payment) {
                    case "현금":
                    case "계좌이체":
                      ++healthCash;
                      break;
                    case "카드":
                      ++healthCard;
                      break;
                  }
                } else if ("pt30회" == item.data().membership) {
                  ptSales += item.data().price;
                  switch (item.data().payment) {
                    case "현금":
                    case "계좌이체":
                      ++ptCash;
                      break;
                    case "카드":
                      ++ptCard;
                      break;
                  }
                } else if ("필라테스3개월" == item.data().membership) {
                  pilatesSales += item.data().price;
                  switch (item.data().payment) {
                    case "현금":
                    case "계좌이체":
                      ++pilatesCash;
                      break;
                    case "카드":
                      ++pilatesCard;
                      break;
                  }
                } else {
                  crossfitSales += item.data().price;
                  switch (item.data().payment) {
                    case "현금":
                    case "계좌이체":
                      ++crossfitCash;
                      break;
                    case "카드":
                      ++crossfitCard;
                      break;
                  }
                }
              }
            });
          });
      }
    })
    .then(() => {
      // 시간 지연용. promise로 처리하여도 오래 걸리는 작업이기 때문에 비효율 적이고 의미없지만 동기처리를 위해 사용
      db.collection("member")
        .doc()
        .collection("payment")
        .get()
        .then((snapshot) => {
          let totalSales = healthSales + ptSales + pilatesSales + crossfitSales;
          let totalCashCount =
            healthCash + ptCash + pilatesCash + crossfitCash + crossfitCash;
          let totalCardCount = healthCard + ptCard + pilatesCard + crossfitCard;
          const template = `
                        <tr class = "table-secondary">
                        <td>헬스</td>
                        <td>${healthSales}원</td>
                        <td>${healthCash}건</td>
                        <td>${healthCard}건</td>
                        </tr>
                        <tr class = "table-secondary">
                        <td>PT</td>
                        <td>${ptSales}원</td>
                        <td>${ptCash}건</td>
                        <td>${ptCard}건</td>
                        </tr>
                        <tr class = "table-secondary">
                        <td>필라테스</td>
                        <td>${pilatesSales}원</td>
                        <td>${pilatesCash}건</td>
                        <td>${pilatesCard}건</td>
                        </tr>
                        <tr class = "table-secondary">
                        <td>크로스핏</td>
                        <td>${crossfitSales}원</td>
                        <td>${crossfitCash}건</td>
                        <td>${crossfitCard}건</td>
                        </tr>
                        <tr class= "table-danger">
                        <td>총 합계</td>
                        <td>${totalSales}원</td>
                        <td>${totalCashCount}건</td>
                        <td>${totalCardCount}건</td>
                        </tr>
                        </tr>

                        `;
          $(".totalsalestb").append(template);
          const label = ["HEALTH", "PT", "PILATES", "CROSSFIT"];
          const data = [healthSales, ptSales, pilatesSales, crossfitSales];
          barChart(label, data, "bar", "myChart");
        });
    });
}

// 3개월, 6개월, 1년 체크
function dateCheck(input) {
  if (input == "3개월") {
    return ago3String;
  } else if (input == "6개월") {
    return ago6String;
  } else return ago12String;
}

// 차트 그리는 함수
function barChart(labelArr, dataArr, kind, id) {
  const data = {
    labels: labelArr,
    datasets: [
      {
        data: dataArr,
        label: "상품별 매출현황",
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: kind,
    data: data,
    options: { responsive: false },
  };
  $("#chartContainer").append(
    `<canvas id="myChart"  width="500" height="500"></canvas>`
  );
  new Chart(document.getElementById(id), config);
}
