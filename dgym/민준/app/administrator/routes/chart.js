const dbdb = firebase.firestore();

const labels = ["HEALTH", "PT", "PILATES", "CROSSFIT"];

const data = {
  labels: labels,
  datasets: [
    {
      data: [30, 100, 40, 20],
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
  type: "bar",
  data: data,
  options: { responsive: false },
};

const myChart = new Chart(document.getElementById("myChart"), config);
