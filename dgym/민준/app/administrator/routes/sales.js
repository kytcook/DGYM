const db = firebase.firestore();
/* let cardTotal = 0;
let cashtotal = 0;
let totalSales = 0;
let cashCount = 0;
let cardCount = 0;
let totalSalary = 0;
let income = 0; */

/* What to DO 📈 
   ⭕1. 날짜값 3개월, 6개월, 1년 단위로 if 문 분기 처리해야함
   ⭕ 2. 조회 버튼 눌렀을때 테이블 보여주고 -> clear 해주는 기능 추가 필요함
      테이블 삭제는 OK, 값이 유지되는 현상 해결 필요함
      ==> 전역변수에 선언해놓았기때문에 계속해서 테이블에 값이 초기화되지않고 쌓이던 것
   ✖ 3. instructor collection의 salary를 끌어오는 방법 생각해봐야함
      ==> promise를 사용하여 시점 문제를 맞추어준다.
  ⭕ 4. 테이블의 맨 마지막 값만 보여주여야 함.. (배열로가능한가..)
      ==> 3개월 조회면 -> 누적해서 쌓아서 보여주는게 맞음 (변경 불필요)
   5. 상품별 매출 그래프 그려주어야함 
   6. select list 옆에 조회 버튼 붙이기 
   7. firebase config 바꿔놓을 것
   8. chartjs size 동적처리해보기*/

/* <------------------------------------날짜값 상수로 가져오기  시작-------------------------------------------> */
// 참고 문서 https://gent.tistory.com/413
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

const lastyear = year - 1;
console.log(lastyear);
let ago12String = lastyear + "-" + month + "-" + day;
console.log("기준일로부터 12개월전입니다: " + ago12String);

/* ----------------------------12Months Ago----------------------------------- */
/* <------------------------------------날짜값 상수로 가져오기 끝--------------------------------------------> */

/* <-----------------------날짜값가져오기-----------------------> */

// 📌 firebase에있는 data들 전체 끌어오는 함수 (사용 XX 바꿔야함)
function search() {
  let cardTotal = 0;
  let cashtotal = 0;
  let totalSales = 0;
  let cashCount = 0;
  let cardCount = 0;
  let totalSalary = 0;
  let income = 0;
  db.collection("member")
    .get()
    .then((snapshot) => {
      const totalData = snapshot.docs.length;

      for (let i = 0; i < totalData; i++) {
        db.collection("member")
          .doc(snapshot.docs[i].id)
          .collection("payment")
          .get()
          .then((snapshot) => {
            snapshot.forEach((item) => {
              totalSales = totalSales + item.data().price;
              console.log("총 판매금액은 ===>" + totalSales);
              totalSalary = 50000;
              income = totalSales - totalSalary;
              console.log("강사 총월급은 ==>" + totalSalary);
              console.log("순수익은 ==>" + income);
              if (item.data().payment == "현금") {
                cashCount++;
              } else {
                cardCount++;
              }
              console.log(
                "cashCount ==>" + cashCount + " cardCount ==>" + cardCount
              );
            });
            //console.log(cashCount + "잘되니");

            const template = `
                          <tr class = "table-secondary">
                            <td>${totalSales}원</td>
                            <td>${totalSalary}원</td>
                            <td>${income}원</td>
                            <td>${cashCount}건</td>
                            <td>${cardCount}건</td>
                            </tr>
                            `;
            $(".totalsalestb").append(template);
          });
      }
    });
}

// ==============================[[[[[[[[[Start OF SELECT LIST]]]]]]]]]=================================;
function changeSelect() {
  //셀렉트리스트에서 선택을한다
  let selectList = document.getElementById("period"); //리스트의 아이디 (period)에서 아이디값가져오기

  if (selectList.options[selectList.selectedIndex].value == "3")
    //------------1번
    document.getElementById("selectBtn").onclick = function () {
      // ----------------2번
      alert("3개월 매출을 조회합니다 👀💗");
      $("tbody").empty(); //조회 (selectBtn) 버튼을 누르면 tbody의 내용을 지운다

      db.collection("member")
        .get()
        .then((snapshot) => {
          // --------------3번
          const totalData = snapshot.docs.length; // member collection 내에 존재하는 문서갯수
          for (let i = 0; i < totalData; i++) {
            // --------------4번
            db.collection("member")
              .doc(snapshot.docs[i].id)
              .collection("payment")
              .get()
              .then((snapshot) => {
                snapshot.forEach((item) => {
                  //
                  //------------------7번
                  //💛💛💛🧡💛시작💛💛💚💛💛❤💛
                  function GetSales() {
                    //--------------8번
                    let totalSales = 0; // 총 매출금액
                    let totalCashCount = 0; // 총 현금 결제 건수
                    let totalCardCount = 0; // 총 카드 결제 건수

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
                    //ago3String = 현재날짜 -3 개월한것 ex) 2022-08-19 => 2022-05-19 값
                    //todayCheck = 현재날짜 값 ex)2022-08-19

                    /* <-------------------------최근3개월매출 끌어오기 시작❗-----------------------------> */
                    if (
                      ago3String < item.data().regDate &&
                      item.data().regDate < todayCheck
                    ) {
                      // 최근 3개월ok?
                      //--------------9번
                      let productName = item.data().membership;
                      switch (
                        productName //--------------10번
                      ) {
                        case "필라테스": // if (productName === '필라테스')
                          if (item.data().payment == "현금") {
                            pilatesCash++;
                            pilatesSales =
                              pilatesSales + item.data().payment.price;
                          } else {
                            // 카드이면
                            pilatesCard++;
                            pilatesSales =
                              pilatesSales + item.data().payment.price;
                          }
                          break;

                        case "크로스핏": // if (productName === '크로스핏')
                          if (item.data().payment == "현금") {
                            crossfitCash++;
                            crossfitSales =
                              crossfitSales + item.data().payment.price;
                          } else {
                            // 카드이면
                            crossfitCard++;
                            crossfitSales =
                              crossfitSales + item.data().payment.price;
                          }
                          break;
                        case "PT":
                          if (item.data().payment == "현금") {
                            ptCash++;
                            ptSales = ptSales + item.data().payment.price;
                          } else {
                            // 카드이면
                            ptCard++;
                            ptSales = crossfitSales + item.data().payment.price;
                          }
                          break;

                        default: // 헬스3개월, 헬스6개월, 헬스12개월은 defalut로 처리한다
                          if (item.data().payment == "현금") {
                            healthCash++;
                            healthSales =
                              healthSales + item.data().payment.price;
                          } else {
                            // 카드이면
                            healthCard++;
                            healthSales =
                              healthSales + item.data().payment.price;
                          }
                          break;
                      } // end of switch 문--------------10번
                      return [
                        ptSales,
                        ptCash,
                        ptCard,
                        healthSales,
                        healthCash,
                        healthCard,
                        pilatesSales,
                        pilatesCash,
                        pilatesCard,
                        crossfitSales,
                        crossfitCash,
                        crossfitCard,
                        totalSales,
                      ];
                    } // end of if  (날짜값 비교) --------------9번
                    /* <-------------------------최근3개월매출 끌어오기 끝❗-----------------------------> */

                    let sales = GetSales();
                    let pptSale = sales[0]; // pptcash = pt 현금건수
                    let pptCash = sales[1]; // pptcash = pt 현금건수
                    let pptCard = sales[2]; // pptcash = pt 현금건수

                    let hSale = sales[3];
                    let hCard = sales[4]; //헬스
                    let hCash = sales[5];

                    let pSale = sales[6];
                    let pCash = sales[7]; //필라테스
                    let pCard = sales[8];

                    let cSale = sales[9];
                    let cCash = sales[10]; // 크로스핏
                    let cCard = sales[11];

                    let tSale = sales[12]; // 총매출
                    const template = `
                        <tr class = "table-secondary">
                        <td>PT</td>
                        <td>${pptSale}pt매출액</td>
                        <td>${pptCash}pt현금결제건</td>
                        <td>${pptCard}pt카드결제건/td>
                        </tr>

                        <tr class = "table-secondary">
                        <td>헬스</td>
                        <td>${hSale}헬스매출액</td>
                        <td>${hCash}헬스현금결제건</td>
                        <td>${hCash}헬스카드결제건/td>
                        </tr>

                        <tr class = "table-secondary">
                        <td>필라테스</td>
                        <td>${pSale}필라매출액</td>
                        <td>${pCash}필라현금결제건</td>
                        <td>${pCard}필라카드결제건/td>
                        </tr>
                        <tr class = "table-secondary">

                        <td>크로스핏</td>
                        <td>${cSale}크로매출액</td>
                        <td>${cCash}크로현금결제건</td>
                        <td>${cCard}크로카드결제건/td>
                        </tr>

                        `;
                    $(".totalsalestb").append(template);
                    const template2 = `
                     <tr>
                <th colspan="4">${tSale}</th>
              </tr>
                    `;
                    $(".totalsalestb").append(template2);
                  } // end of GetSales function --------------8번
                }); // end of snapshot.foreach ( item) ------------------7번
                //  } // end of second for //------------------6번
              }); //end of  then.snapshot  //------------------5번
          } //end of first For // --------------4번
        }); // end of first snapshot // --------------3번
    };
  // 버튼클릭 function () 에 대한 대괄호 ----------------------------------2번
  else if (selectList.options[selectList.selectedIndex].value == "6") {
    $("tbody").empty();
    document.getElementById("selectBtn").onclick = function () {
      alert("6개월조회버튼 클릭!!");
      search();
    };
  } else if (selectList.options[selectList.selectedIndex].value == "12") {
    $("tbody").empty();
    document.getElementById("selectBtn").onclick = function () {
      search();
    };
  }
} // end of selectlist 3개월. -----------------------1번
// ==============================[[[[[[[[[END OF SELECT LIST]]]]]]]]]=================================;
