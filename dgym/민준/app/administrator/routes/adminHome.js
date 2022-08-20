const db = firebase.firestore();
const chartOne = document.getElementById("myChart").getContext("2d");
const chartTwo = document.getElementById("lineChart").getContext("2d");
////////////

const pieChart = new Chart(chartOne, {
  type: "doughnut", // pie, line, doughnut, polarArea
  data: {
    labels: ["헬스3개월", "헬스6개월", "헬스pt", "필라테스", "크로스핏"],
    datasets: [
      {
        label: "상품 판매 건수",
        data: [20, 30, 10, 15, 25],
        backgroundColor: [
          "rgba(255, 99, 132, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(255, 206, 86, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(153, 102, 255, 0.4)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  },
  options: {
    tolltips: {
      enabled: true,
    },
    title: {
      display: true,
      text: "상품 건수",
      fontSizee: 20,
      fontColor: "black",
    },
    legend: {
      display: true,
      position: "right",
    },
  },
});

//////////// 최근 6개월 구함 ////////
let day = []; // 6개월의 date
day.length = 6;
const now = new Date();
let year = String(now.getFullYear());
let month = String(now.getMonth());
let date = parseInt(year + month);
console.log(year + month);

let j = 0;
for (let i = 5; i >= 0; --i) {
  let d = date - i;
  let yyyy = String(d).slice(0, 4);
  let mm = String(d).slice(4).padStart(2, "0");
  day[j] = yyyy + "-" + mm;
  j++;
}
console.log(day);

// 가입할 때 판매건수에 대해서 저장해야한다 ( firstRegdate 불러오기)
// 필드는 각 년도와 날짜 ex) 2022-05
// 최근 6개월 데이터는 해당 오늘전 달에 대해서 구하기

// 배열로 건수 뽑아내기
const countMem = [0, 0, 0, 0, 0, 0]; // 월별 가입자수 [0] = old [5] = 전 월

db.collection("member")
  .get()
  .then((snapshot) => {
    snapshot.forEach((item) => {
      const regDate = item.data().firstRegDate.slice(0, 7);
      if (day[0] == regDate) ++countMem[0];
      else if (day[1] == regDate) ++countMem[1];
      else if (day[2] == regDate) ++countMem[2];
      else if (day[3] == regDate) ++countMem[3];
      else if (day[4] == regDate) ++countMem[4];
      else ++countMem[5];
    });
    const lineChart = new Chart(chartTwo, {
      type: "line", // pie, line, doughnut, polarArea
      data: {
        labels: day, // 최근 6개월 month 배열
        datasets: [
          {
            label: "월별 가입자 통계",
            data: countMem, // 데이터 들어올 곳[배열]
            backgroundColor: [
              "rgba(255, 99, 132, 0.4)",
              "rgba(54, 162, 235, 0.4)",
              "rgba(255, 206, 86, 0.4)",
              "rgba(75, 192, 192, 0.4)",
              "rgba(153, 102, 255, 0.4)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        tolltips: {
          enabled: true,
        },
        title: {
          display: true,
          text: "가입자",
          fontSizee: 20,
          fontColor: "black",
        },
        legend: {
          display: true,
          position: "right",
        },
      },
    });
  });

// 멤버 현황 조회
db.collection("member")
  .get()
  .then((snapshot) => {
    let totalMem = snapshot.docs.length; // 총 회원수
    let hMem = 0;
    let pMem = 0;
    let cMem = 0;
    $("#totalMem").html(`${totalMem}명`);
    /////////////////////////////////////
    db.collection("sort")
      .get()
      .then((snapshot) => {
        snapshot.forEach((item) => {
          if (item.id == "health") hMem = item.data().member;
          else if (item.id == "pilates") pMem = item.data().member;
          else cMem = item.data().member;
        });
      })
      .then(() => {
        $("#healthMem").html(`${hMem}명`);
        $("#pilatesMem").html(`${pMem}명`);
        $("#crossfitMem").html(`${cMem}명`);
      });
  });
// 온라인 현황 조회
db.collection("user")
  .get()
  .then((snapshot) => {
    let totalUser = snapshot.docs.length;
    $("#totalUser").html(`${totalUser}명`);
  });

// 강사 현황 조회
db.collection("insturctor")
  .get()
  .then((snapshot) => {
    let hIns = 0;
    let pIns = 0;
    let cIns = 0;
    /////////////////////////////////////
    db.collection("sort")
      .get()
      .then((snapshot) => {
        snapshot.forEach((item) => {
          if (item.id == "health") hIns = item.data().instructor;
          else if (item.id == "pilates") pIns = item.data().instructor;
          else cIns = item.data().instructor;
        });
      })
      .then(() => {
        $("#healthIns").html(`${hIns}명`);
        $("#pilatesIns").html(`${pIns}명`);
        $("#crossfitIns").html(`${cIns}명`);
      });
  });

// db.collection("user")
//   .get()
//   .then((snapshot) => {
//     let totalUser = snapshot.docs.length;
//     console.log(totalUser);
//     $("#").html(`${totalUser}명`);
//   });

// 모든 문서 돌아야할 때
// function searchList(snapshot, totalMem, hMem, pMem, cMem, callback) {
//   for (let i = 0; i < totalMem; i++) {
//     const docRef = snapshot.docs[i].id;
//     db.collection("member")
//       .doc(docRef)
//       .collection("payment")
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((item) => {
//           let sort = item.data().sort;
//           console.log(sort);
//           if (sort == "헬스") ++hMem;
//           else if (sort == "필라테스") ++pMem;
//           else if (sort == "크로스핏") ++cMem;
//         });
//       });
//   }
//   callback(hMem, pMem, cMem);
// }
