---
title:
aliases: []
tags: []
---
패키지 메타데이터나 의존성 처리 방법, 배포판의 철학 때문에 분화가 되었다.

- 저수준 패키지 매니저 : 실제 패키지의 설치, 업데이트, 삭제 등을 수행
- 고수준 패키지 매니저 : 의존성의 해결, 패키지 검색 등의 기능을 제공

| 구분          | [[데비안]] 계열                        | [[레드햇]] 계열 |
| ----------- | --------------------------------- | ---------- |
| 저수준 패키지 매니저 | dpkg                              | rpm        |
| 고수준 패키지 매니저 | [[apt vs apt-get\|apt-get / apt]] | yum        |
**See also.**
- [[데비안 vs 레드햇]]
- [[apt vs apt-get]]
**Sources.**
- [리눅스 패키지 비교(apt,dpkg,yum,rpm)](https://minhan2.tistory.com/entry/%EB%A6%AC%EB%88%85%EC%8A%A4-%ED%8C%A8%ED%82%A4%EC%A7%80-%EB%B9%84%EA%B5%90aptdpkgyumrpm)