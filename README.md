# DGYM 헬스장 웹사이트 : firebase

### 개요

파이어베이스를 이용한 헬스장 웹사이트 구현<br/>
기간 : 2022-07-15 ~ 2022-08-25<br/>
프로젝트 작업 : https://github.com/kytcook/DGYM_repo<br/>
회의록-notion : https://www.notion.so/messenger-kh/D-GYM-b3dba709e94a4264833fac6186b2f802

----------------------------------------------------------------------------------------------
### client페이지와 admim페이지를 나눔!

![image](https://user-images.githubusercontent.com/98031858/187029315-39f23f1b-ab79-4eec-9b00-04564a139a02.png)
![image](https://user-images.githubusercontent.com/98031858/187032708-e9716f34-cd02-41c8-90af-f9fd53049aea.png)
administrator/views/adminHome.html

---------------------------------------------------------------------------------------------
### 이용자가 상담예약 남기면 파이어베이스를 거쳐 관리자 예약관리에서 누적된 데이터 확인 가능
-> 이런식으로 대부분의 기능들이 파이어베이스 api를 이용하여 CRUD가 이뤄짐
![image](https://user-images.githubusercontent.com/98031858/187032736-36d6e6b8-2ebd-47ca-b4ea-340b9e376fb4.png)
![예약관리](https://user-images.githubusercontent.com/98031858/187032765-86575f92-2831-4e9a-9ff2-62d6fb689ada.jpg)

---------------------------------------------------------------------------------------------
### 로그인이용자의 저장된 프로필 데이터를 읽어옴
![image](https://user-images.githubusercontent.com/98031858/187032933-a627ddfb-e49a-4945-8ddd-1650527fc7a4.png)

