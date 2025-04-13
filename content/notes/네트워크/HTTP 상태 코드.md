---
title:
aliases: []
tags: []
---
주요 [[HTTP]] 응답 코드
### 2xx : 성공
| 응답코드        | 설명                     |
| ----------- | ---------------------- |
| 200 OK      | 일반적인 성공                |
| 201 Created | 리소스(회원가입, 게시글 작성 등) 생성 |
### [[3xx]] : 리다이렉션
| 응답코드                   | 메소드 | 이동  |
| ---------------------- | --- | --- |
| 301 Moved Permanently  | 변경  | 영구  |
| 302 Found              | 변경  | 일시  |
| 307 Temporary Redirect | 유지  | 일시  |
| 308 Permanent Redierct | 유지  | 영구  |
- [[3XX|301 vs 302]]
### 4xx : 클라이언트 오류
| 응답코드                   | 설명                 |
| ---------------------- | ------------------ |
| 400 Bad Request        | 요청값을 잘못 넣은 경우      |
| 401 Unauthorized       | [[인증]] 오류          |
| 403 Forbidden          | [[인가]] 오류          |
| 404 Not Found          | 서버는 찾았으나 데이터 없음    |
| 405 Method Not Allowed | 허용되지 않은 메소드        |
| [[409 Conflict]]       | 사용자의 요청이 서버와 충돌    |
| 429 Too Many Requests  | [[Rate Limit]]에 걸림 |

### 5xx : 서버 오류
| 응답코드                      | 설명                          |
| ------------------------- | --------------------------- |
| 500 Internal Server Error | 일반적인 서버 오류                  |
| 502 Bad Gateway           | [[게이트웨이]]가 연결된 서버로부터 응답 잘못됨 |
| 504 Gateway Timeout       | [[게이트웨이]]가 연결된 서버로부터 응답 없음  |


**See also.**
- [[인증 vs 인가]]

**References.**
- [HTTP 상태 코드 - HTTP \| MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Status)
- [HTTP/응답 코드 - 나무위키](https://namu.wiki/w/HTTP/%EC%9D%91%EB%8B%B5%20%EC%BD%94%EB%93%9C)

