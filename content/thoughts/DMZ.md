---
title: 
aliases: 
tags:
  - seed
---
Demilitarized Zone

전체 내부 네트워크 중 외부에 공개된 서버 영역

웹 서버, [[DNS]], 이메일 서버, [[FTP]] 등 외부에서 접근해야 할 필요가 있는 서버들을 위해 구성

외부에서 DMZ로 들어는 트래픽은 [[PAT]](포트 주소 변환)로 제어한다.

![400](https://i.imgur.com/hwVdo2m.png)

### 방화벽 설정
| 출발 \ 도착 | 내부  | DMZ | 외부  |
| ------- | --- | --- | --- |
| 내부      | -   | O   | X   |
| DMZ     | X   | -   | O   |
| 외부      | X   | O   | -   |

### 특이사항
- WAS는 DB와 결부되어있기 때문에 내부 네트워크에 둔다. 그리고 DMZ에 리버스 프록시를 둬 WAS를 감춘다. 보통 web 애플리케이션 안에 프록시를 직접 구현하는 듯


**See also.**
- Type here

**Sources.**
- [DMZ 이란 무엇이고 어떻게 활용하는가?](https://m.blog.naver.com/innoviss/222246852119)
- [\[백엔드 핵심\] #1.2 포워드 프록시, 리버스 프록시](https://velog.io/@wogud7587/%EB%B0%B1%EC%97%94%EB%93%9C-%ED%95%9C%EB%B0%94%ED%80%B4-1.2-WAS%EC%99%80-WS)
- [프록시 서버(Proxy Server)와 DMZ 서버](https://juran-devblog.tistory.com/228)

