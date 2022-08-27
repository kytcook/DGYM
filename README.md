# DGYM 헬스장 웹사이트 : firebase
-----------
## 개요
파이어베이스를 이용한 헬스장 웹사이트 구현
기간 : 2022-07-15 ~ 2022-08-25
##
## client페이지와 admim페이지를 나눔
![image](https://user-images.githubusercontent.com/98031858/187029315-39f23f1b-ab79-4eec-9b00-04564a139a02.png)
![image](https://user-images.githubusercontent.com/98031858/187030034-066d7577-c68d-46bf-a9c7-c4cdc3abd40c.png)
administrator/views/adminHome.html


## 이용자가 상담예약 남기면 파이어베이스를 거쳐 관리자 예약관리에서 누적된 데이터 확인 가능
-> 이런식으로 대부분의 기능들이 파이어베이스 api를 이용하여 CRUD가 이뤄짐
![image](https://user-images.githubusercontent.com/98031858/187030622-1dd92a30-6aef-4719-8c1d-52600243805f.png)
![image](https://user-images.githubusercontent.com/98031858/187030162-4ee06439-b4fe-47f3-91c2-15ef3db05509.png)


## 로그인이용자의 저장된 프로필 데이터를 읽어옴
![image](https://user-images.githubusercontent.com/98031858/187030689-1e81980a-0809-42d4-a577-d390f7898482.png)
