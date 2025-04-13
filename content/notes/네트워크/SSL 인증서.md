---
title: 
aliases:
  - TLS 인증서
tags:
---
[[SSL]] 암호화에 사용하는 디지털 인증서로 [[HTTPS]] 통신을 가능하게 한다.

SSL 인증서가 유효하려면 [[인증 기관]]\(CA)에서 인증서를 발급받아야 한다.

조직 내에서만 사용한다면 [[자체 서명된 SSL 인증서]]를 사용할 수도 있다. 다만 이 경우 일반적인 경우 "안전하지 않음"으로 표시될 수 있다.

**인증서에 포함하는 정보**
- 인증서가 발급된 대상 [[도메인 이름]]
- 발급 받은 사람, 조직, 장치
- 발급한 인증 기관
- 인증 기관의 디지털 서명
- 관련 하위 도메인
- 인증서 발급 날짜
- 인증서 만료 날짜
- 공개 키(개인 키는 비밀로 유지됨)


**See also.**
- [[SSL vs TLS]]
- [[HTTP vs HTTPS]]

**References.**
- [SSL 인증서란? \| 무료 SSL인증서 \| Cloudflare](https://www.cloudflare.com/ko-kr/learning/ssl/what-is-an-ssl-certificate/)


