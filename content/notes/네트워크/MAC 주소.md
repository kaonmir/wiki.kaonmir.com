---
title: 
aliases: []
tags:
---
Media Access Control Address

[[네트워크 인터페이스]]에 할당된 고유 번호. `00:1A:2B:3C:4D:5E` 같은 48비트 16진수 형식

[[OSI 모델|OSI 2계층]]에서 [[데이터 프레임]]을 송수신하는데 사용되며 [[ARP]]를 통해 [[IP 주소]]와 매핑된다.

**구성**
- 앞 24비트 : 제조사 코드(OUI)
- 뒤 24비트 : 기기 코드

**확인 방법**
- `ifconfig | grep "ether"`

**See also.**
- [[MAC 스푸핑]]

**References.**




