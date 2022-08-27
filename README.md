# DGYM 헬스장 웹사이트 : firebase
세미프로젝트

기간 : 2022-07-15 ~ 2022-08-25

## 개요
파이어베이스를 이용한 헬스장 웹사이트 구현
------------
#### client페이지와 admim페이지를 나눔
![image](https://user-images.githubusercontent.com/98031858/187029315-39f23f1b-ab79-4eec-9b00-04564a139a02.png)
![image](https://user-images.githubusercontent.com/98031858/187030034-066d7577-c68d-46bf-a9c7-c4cdc3abd40c.png)
administrator/views/adminHome.html

#### 클라이언트 상담예약 남기면 파이어베이스를 거쳐 관리자 예약관리에서 정보를 읽어옴
-> 이런식으로 대부분의 기능들이 파이어베이스 api를 이용하여 CRUD가 이뤄짐
![image](https://user-images.githubusercontent.com/98031858/187030116-61d8855b-0c32-4233-8b1b-fb1944201a22.png)
![image](https://user-images.githubusercontent.com/98031858/187030162-4ee06439-b4fe-47f3-91c2-15ef3db05509.png)

#### 로그인이용자의 기본프로필을 읽어오고 내 정보수정에서 변경시 해당 정보를 불러옴
![image](https://user-images.githubusercontent.com/98031858/187030326-22f6f575-d683-4a9f-a019-a47cd5fcb64e.png)
