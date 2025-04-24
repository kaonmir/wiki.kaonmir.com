---
title:
aliases: []
tags: []
---
One Time Password

[[인증 요소]] 중 하나로 로그인할 때마다 무작위 번호를 발급받아 사용하는 보안 시스템

### 비밀번호 생성 방식
- HOTP(HMAC-based OTP) : 클라이언트와 서버가 각각 counter 값을 비교
    - 클라이언트는 인증 요청시 counter를 증가하고, 서버는 인증 성공시 증가한다.
    - 이런 불일치 문제가 있어 과거의 유물이 된 듯
- TOTP(Time-based OTP) : 시간에 따라 연산한 값을 비교
    - Recovery Code와 시간 정보로 생성하기 때문에 recovery code만 보관하면 언제든 복구 가능하다.

### 발급 방식
- 하드웨어 OTP
- 소프트웨어 OTP
    - 모바일 앱 : ([Authy](https://www.authy.com/), [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en), 등)
    - 이메일/SMS

**See also.**
- [[다요소 인증]]

**Sources.**
- [OTP 동작원리](https://www.howdy-mj.me/general/otp)


