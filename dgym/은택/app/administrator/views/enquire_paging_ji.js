//전체레코드 갯수
class PageBar {
  totalRecord;
  //페이지당 레코드 수
  numPerPage; // 10개씩이다
  //블럭당 디폴트 페이지 수
  pagePerBlock = 3;
  //총페이지 수
  totalPage;
  //총블럭 수
  totalBlock;
  //현재 내가 바라보는 페이지 수
  nowPage;
  //현재 내가 바라보는 블럭 수
  nowBlock;
  //적용할 페이지 이름
  pagePath;
  pagination;

  constructor(numPerPage, totalRecord, nowPage, pagePath) {
    this.numPerPage = numPerPage;
    this.totalRecord = totalRecord;
    //alert(totalRecord);
    this.nowPage = nowPage;
    this.pagePath = pagePath;
    this.totalPage = Math.ceil(this.totalRecord / this.numPerPage); // 47.0/10=> 4.7 4.1->5page 4.2->5page
    this.totalBlock = Math.ceil(this.totalPage / this.pagePerBlock); //5.0/2=> 2.5-> 3장
    //현재 내가바라보는 페이지 : (int)((double)4-1/2)
    this.nowBlock = Math.floor(this.nowPage / this.pagePerBlock);
  }
  //setter메소드 선언
  setPageBar() {
    console.log("nowBlock:" + this.nowBlock);
    let pageLink = "";
    //전체 레코드 수가 0보다 클때 처리하기
    if (this.totalRecord > 0) {
      //nowBlock이 0보다 클때 처리
      //이전 페이지로 이동 해야 하므로 페이지 번호에 a태그를 붙여야 하고
      //pagePath뒤에 이동할 페이지 번호를 붙여서 호출 해야함.

      // 이전과 다음으로 넘거가려고 할때 이미지 버튼을 추가해서 ..!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (this.nowBlock > 0) {
        //(1-1)*2+(2-1)=1
        pageLink +=
          "<a href='" +
          this.pagePath +
          "?nowPage=" +
          ((this.nowBlock - 1) * this.pagePerBlock + (this.pagePerBlock - 1)) +
          "'>";
        pageLink += "<img border=0 src='/images/bu_a.gif'>";
        pageLink += "</a>&nbsp;&nbsp;";
      }
      for (let i = 0; i < this.pagePerBlock; i++) {
        //현재 내가 보고 있는 페이지 블록일때와
        // 현재 내가 바라보고 있는 페이지는 링크가 걸리지 않게  굵은 글씨로 표시
        if (this.nowBlock * this.pagePerBlock + i == this.nowPage) {
          pageLink +=
            "<b>" + (this.nowBlock * this.pagePerBlock + i + 1) + "</b>&nbsp;";
        }
        //그렇지 않을 때를 나누어 처리해야 함.
        else {
          pageLink +=
            "<a href='" +
            this.pagePath +
            "?nowPage=" +
            (this.nowBlock * this.pagePerBlock + i) +
            "'>" +
            (this.nowBlock * this.pagePerBlock + i + 1) +
            "</a>&nbsp;";
        }
        //모든 경우에 pagePerBlock만큼 반복되지 않으므로 break처리해야 함.
        //주의할 것.
        if (this.nowBlock * this.pagePerBlock + i + 1 == this.totalPage) break;
      }
      //현재 블록에서 다음 블록이 존재할 경우 이미지 추가하고 페이지 이동할 수 있도록
      //a태그 활용하여 링크 처리하기
      if (this.totalBlock > this.nowBlock + 1) {
        pageLink +=
          "&nbsp;&nbsp;<a href='" +
          this.pagePath +
          "?nowPage=" +
          (this.nowBlock + 1) * this.pagePerBlock +
          "'>";
        pageLink += "<img border=0 src='/images/bu_b.gif'>";
        pageLink += "</a>";
      }
    }
    this.pagination = pageLink;
  }
  //getter메소드 선언
  getPageBar() {
    this.setPageBar();
    return this.pagination;
  }
} ////////////// end of PageBar

//Database 에서 데이터 가져오기
function dbBoard() {
  const db = firebase.firestore();

  /*====== 페이지 처리에 필요한 변수 선언하기 =======*/

  let num = 0; // 페이지 순번담기
  let total = 0; //전체 레코드 수
  let numPerPage = 4; // 한페이지에 몇개씩 ?
  let nowPage = 0; // 현재 바라보는 페이지 , 0부터 준다

  let param = new URLSearchParams(document.location.search);
  nowPage = param.get("nowPage");
  /*====== 페이지 처리에 필요한 변수 선언하기 끝 =======*/

  db.collection("enquire")
    .orderBy("registDate", "desc")
    .get()
    //콜백영역 - callback함수, fetch함수, await, async             ///////////////////////////////////////ㅠㅠㅠㅠㅠ
    .then((snapshot) => {
      console.log(snapshot); //[Object, Object] -> JSON.parse
      //console.log(JSON.stringify(snapshot));
      total = snapshot.docs.length; //토탈레코드가져오기
      console.log("전체 레코드 수==>" + total);

      for (
        let i = nowPage * numPerPage;
        i < nowPage * numPerPage + numPerPage;
        i++
      ) {
        /* 전체로 보고싶을때 */
        //for(let i = 0; i< total; i++){

        // 무조건 페이지 레코드 수만큼 반복되는 구조이므로 해당 페이지에
        // 한 개 레코드만 있는 경우는 break문으로 처리
        if (total === i) break;
        num = i;

        console.log(
          snapshot.docs[i].id + ", title:" + snapshot.docs[i].data().title
        );
        //}

        const template = `
          <tr>
            <th scope="row">${++num}</th>
            <td><a href="./questionmodal.html?id=${
              snapshot.docs[i].id
            }"" data-bs-toggle="modal"">${snapshot.docs[i].data().title}<a></td>
            <td>${snapshot.docs[i].data().name}</td>
            <td>${snapshot.docs[i].data().gender}</td>
          </tr>
        `;
        $(".enquire-article").append(template);
      } /////// end of for
      // $(".pagination").append("");

      /* ====== 페이지 네비게이션 처리 위치 ======= */

      /*   const pagination = "<a href>[1][2][3]"  // 이곳은 변수로 처리했기에 필요없을듯 */
      const pagePath = "question.html";
      const pb = new PageBar(numPerPage, total, nowPage, pagePath);
      console.log(pb.getPageBar()); // class PageBar에서 생성되는 링크 출력해봄.
      $(".pagination").append(pb.getPageBar());
    }); ////////////end of callback
}
