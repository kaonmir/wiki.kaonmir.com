---
title: TCP/IP 모델
aliases:
  - TCP/IP
  - TCP/IP 모델
tags: []
---

네트워크 통신에서 사용되는 실질적인 프로토콜 모음(스택), HTTP, TCP, IP 등이 여기에 속한다.

![](https://i.imgur.com/itHy4ph.jpeg)
참고 : [[OSI vs TCPIP|OSI vs TCP/IP]]

### L1: Network Access Layer

- 데이터 단위 : 프레임
- 전송 주소 : [[MAC 주소]]
- 프로토콜 : [[Ethernet]], [[Wi-Fi]], [[PPP]]
- OSI 모형 : 물리 계층

다른 컴퓨터와 직접 통신하는 물리적인 기능을 수행, 네트워크 인터페이스에 할당된 MAC address로 식별한다.

### L2: Internet Layer

- 데이터 단위 : 패킷
- 전송 주소 : IP
- 프로토콜 : [[IP]], [[ICMP]], [[ARP]]

### L3: Transport Layer

- 데이터 단위 : 세그먼트
- 전송 주소 : [[포트|port]]
- 프로토콜 : [[TCP]], [[UDP]]
  애플리케이션 간의 논리적인 통신을 수행하는 계층

### L4: Application Layer

- 데이터 단위 : Data/Message
- 전송 주소 : 프로토콜마다 다름
- 프로토콜 : [[HTTP]], [[FTP]], [[SMTP]], [[DNS]], [[Telnet]]
