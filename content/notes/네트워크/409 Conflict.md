---
title:
aliases: []
tags: []
---

클라이언트의 요청이 서버의 현재 상태와 충돌하여 요청을 처리할 수 없는 상태

**예시**
- 이미 존재하는 계정입니다.
- 이미 예약이 완료된 좌석입니다.
- application/json 으로 보내야 하는데 FormData로 보낼 때
- `/foo/bar.txt` 파일을 생성하려는데 `/foo` 폴더가 존재하지 않을 때

**See also.**

**Sources.**
- [409 Conflict - HTTP \| MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409)
- [HTTP 409 Conflict 에러란? 원인 및 해결방법](https://earscoming.tistory.com/entry/server-HTTP-409-Conflict-%EC%97%90%EB%9F%AC%EB%9E%80-%EC%84%A4%EB%AA%85-%EB%B0%8F-%ED%95%B4%EA%B2%B0%EB%B0%A9%EB%B2%95)