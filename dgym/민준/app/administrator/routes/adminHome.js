const db = firebase.firestore();
const chartOne = document.getElementById("myChart").getContext("2d");
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

db.collection("user")
  .get()
  .then((snapshot) => {
    let totalUser = snapshot.docs.length;
    console.log(totalUser);
    $("#totalUser").html(`${totalUser}명`);
  });

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
