//절차지향적인 언어들...
//전체레코드 갯수
class PageBar {
  totalRecord;
  //페이지당 레코드 수
  numPerPage; // 10개씩이다
  //블럭당 디폴트 페이지 수 - 여기서는 일단 2개로 정함.
  pagePerBlock = 2;
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
      if (this.nowBlock > 0) {
        //(1-1)*2+(2-1)=1
        pageLink +=
          "<a href='" +
          this.pagePath +
          "?nowPage=" +
          ((this.nowBlock - 1) * this.pagePerBlock + (this.pagePerBlock - 1)) +
          "'>";
        pageLink += "<img border=0 src='/img/bu_a.gif'>";
        pageLink += "</a>&nbsp;&nbsp;";
      }
      for (let i = 0; i < this.pagePerBlock; i++) {
        //현재 내가 보고 있는 페이지 블록 일때와
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
        pageLink += "<img border=0 src='/img/bu_b.gif'>";
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
} // end of PageBar
///////////////////////////////////////////////////////////////////
// Database에서 데이터 가져오기
const db = firebase.firestore();
// 페이징 처리에 필요한 변수 선언 //
let num = 0; // 페이지 순번 담음
let total = 0; // 전체 레코드 수
let numPerPage = 2; // 한페이지에 몇개씩 뿌릴건가
let nowPage = 0; // 현재 내가 바라보는 페이지
let params = new URLSearchParams(document.location.search);
nowPage = params.get("nowPage");
// 페이징 처리에 필요한 변수 선언 //

db.collection("board")
  .get()
  .then((snapshot) => {
    console.log(snapshot); //Object, object -> JSON.parse() or JSON.stringify()
    total = snapshot.docs.length;
    console.log("전체 레코드 수===> " + total);
    for (
      let i = nowPage * numPerPage;
      i < nowPage * numPerPage + numPerPage;
      i++
    ) {
      // for (let i = 0; i < total; i++) { --> 전체 데이터 조회
      // 무조건 페이지 레코드 수만큼 반복되는 구조이므로 해당 페이지에
      // 한 개 레코드만 있는 경우는 break문 처리한다
      if (total === i) break;
      num = i;
      console.log(
        snapshot.docs[i].id + ", 제목:" + snapshot.docs[i].data().제목
      );
      // snapshot.forEach((item) => {
      // 코드양은 늘어나더라도 복잡도 증가하지 않도록
      const templete = `
                                <tr>
                                  <th scope="row">${++num}</th>
                                  <td><a href="./read.html?id=${
                                    snapshot.docs[i].id
                                  }" class="btn btn-primary" data-bs-toggle="modal" >
                                    ${snapshot.docs[i].data().제목}</a></td>
                                  <td>${snapshot.docs[i].data().작성자}</td>
                                  <td>${snapshot.docs[i].data().작성일}</td>
                                </tr>
            `;
      $(".board-content").append(templete); // 데이터가 저장된 만큼 찍힌다.
    } // end of for
    // 페이지 네비게이션 처리 위치
    // const pagenation = "[1][2][3]";
    const pagePath = "list.html";
    const pb = new PageBar(numPerPage, total, nowPage, pagePath);
    // console.log(pb.getPageBar()); class PageBar에서 생성되는 링크 출력하여 테스트
    $(".pagenation").append(pb.getPageBar());
  }); // end of callback
