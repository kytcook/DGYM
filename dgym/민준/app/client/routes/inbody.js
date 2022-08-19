const weight = []; // 몸무게
const muscles = []; // 근육량
const fat = []; // 체지방량
const labels = []; // 날짜
let bodyFatPercent = [];
let i = 0;
const db = firebase.firestore();
const pupple = "rgb(204, 153, 255)";
const yello = "rgb(255, 204, 000)";
const pink = "rgb(255, 102, 153)";
let userUid = "";

// 필요한 변수가 뭐냐
// title = 체중, 근육량 arr = weight / muscles
// 차트 그리기
function dbSearch(title, arr, id, chartJs, color) {
  db.collection("user")
    .doc(userUid)
    .collection("inbody")
    .orderBy("regDate", "asc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((item) => {
        if (title == "체중") {
          arr[i] = item.data().weight;
        } else if (title == "골격근량") {
          arr[i] = item.data().muscles;
        } else if (title == "체지방량") {
          arr[i] = item.data().fat;
        }
        labels[i] = item.data().regDate;
        i++;
      });
    })
    .then(() => {
      i = 0;
      chartJs(title, arr, id, color);
    });
}
//
function chartJs(title, arr, id, color) {
  i = 0;
  let data = {
    labels: labels,
    datasets: [
      {
        label: title,
        backgroundColor: color,
        borderColor: color,
        data: arr,
        tension: 0.2,
      },
    ],
  };
  let config = {
    type: "line",
    data: data,
    options: {
      animations: {
        radius: {
          duration: 400,
          easing: "linear",
          loop: (context) => context.active,
        },
      },
      hoverRadius: 12,
      hoverBackgroundColor: color,
      interaction: {
        mode: "nearest",
        intersect: false,
        axis: "x",
      },
    },
  };
  new Chart(document.getElementById(id), config);
}

// 로그인 및 로그아웃 처리하려면 항상 onAuthStateChanged()사용하기
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userUid = user.uid;
    const login = document.querySelector("#login");
    login.textContent = "logout";
    login.id = "logout";
    login.addEventListener("click", logout);
    login.classList.add("btn-danger");

    // 마이페이지
    const div = document.querySelector(".btn-group");
    const mypage = document.createElement("a");
    mypage.setAttribute("href", "/client/views/mypage/membership.html");
    mypage.innerHTML = `
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    id="mypage"
                  >${user.displayName}님
                  </button>
          `;
    div.appendChild(mypage);
    // 차트 그리기
    dbSearch("체중", weight, "weight", chartJs, pupple);
    dbSearch("골격근량", muscles, "muscles", chartJs, yello);
    dbSearch("체지방량", fat, "fat", chartJs, pink);
  }
});

// 체지방률보기
document.getElementById("bodyFat").addEventListener("click", () => {
  let j = 0;
  fat.forEach((item) => {
    console.log(((item / weight[j]) * 100).toFixed(2));
    bodyFatPercent[j] = ((item / weight[j]) * 100).toFixed(2);
    j++;
  });
  let data = {
    labels: labels,
    datasets: [
      {
        label: "체지방률",
        data: bodyFatPercent,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  let config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  let myLineChart = new Chart(document.getElementById("bodyFatGraph"), config);
  document
    .querySelector("#cancel")
    .addEventListener("click", () => myLineChart.destroy());
});

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("로그아웃 처리 되었습니다");
      window.location.replace("../../../index.html");
    })
    .catch((error) => {
      console.log(error);
    });
}

$("#btnInsert").click(() => {
  let today = new Date();
  let year = String(today.getFullYear()).padStart(2, "0");
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let date = String(today.getDate()).padStart(2, "0");
  const weight = $("#weightInput").val();
  const muscles = $("#musclesInput").val();
  const fat = $("#fatInput").val();
  console.log(weight);
  console.log(muscles);
  console.log(fat);
  db.collection("user")
    .doc(userUid)
    .collection("inbody")
    .add({
      weight: weight,
      muscles: muscles,
      fat: fat,
      regDate: `${year}-${month}-${date}`,
    })
    .then(() => {
      alert("인바디 정보가 등록되었습니다^o^");
      window.location = `./inbody.html`;
    });
});
