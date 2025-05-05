---
title:
aliases:
tags:
  - 씨앗
---
Asynchronous event-driven 자바스크립트 런타임으로 브라우저 밖에서도 JS를 실행할 수 있도록 지원합니다.

Node.js는 싱글 스레드 논블로킹 모델로 구성되어 있습니다.

---

파일 시스템(read, write)이나 DNS 조회 같은 작업은 OS 레벨에서 비동기적으로 처리할 수 없습니다. 그래서 Node.js는 이런 작업들도 *비동기로 실행하는 것처럼* 보이도록 **스레드 풀**을 사용합니다. 

### Overview
![https://www.simform.com/blog/what-is-node-js/](https://i.imgur.com/aeG3x45.jpeg)
(Source. https://www.simform.com/blog/what-is-node-js)

> Woker Threads = Thread Pool

1. 사용자는 `node index.js` 명령을 실행합니다.
2. [[#V8]]은 index.js 파일을 해석하고, 동기 작업은 직접 실행합니다.
3. **V8**는 비동기 작업을 네이티브 바인딩(C++로 변환)을 통해 Libuv에 위임합니다.[^1]
    1. **Libuv**는 위임받은 작업을 커널의 비동기 syscall을 호출해 처리합니다. 만약 Kernel에 비동기 syscall이 없는 작업(DB, DNS, File I/O)이라면 스레드 풀에 푸시합니다.
    2. **Worker Thread**는 스레드 풀에서 작업을 pop해 동기적(sync)으로 실행합니다.
4. 작업이 완료되면 **Libuv**는 콜백 큐에 콜백 함수를 푸시합니다.
5. **Libuv의 Event Loop**는 V8의 콜스택이 비어 있다면 콜백 큐를 pop해 V8의 콜스택에 푸시합니다.
6. **V8**은 콜백 함수를 실행합니다.

## V8
자바스크립트 코드를 실행하는 오픈 소스 엔진입니다.

[[JVM]]과 흡사한 점이 있습니다.
1. **인터프리터 + JIT 컴파일러 조합**
    - JVM: 바이트코드를 인터프리트 실행하며, 자주 호출되는 코드는 JIT 컴파일러(예: HotSpot)가 기계어로 변환
    - V8: Ignition 인터프리터가 바이트코드를 실행하고, TurboFan JIT 컴파일러가 핫 코드를 최적화된 기계어로 변환
2. **바이트코드 기반 실행**
    - JVM: Java 소스 코드 → `.class` 바이트코드 → JVM에서 실행.
    - V8: JavaScript 소스 코드 → Ignition 바이트코드 → V8 가상 머신에서 실행

![](https://i.imgur.com/EGzfgpT.png)
(Source. https://wikidocs.net/223219)

**구성 요소**
- **이그니션**: Interpreter. J
- **터보팬**: 
## Libuv


[^1]: [libuv의 이벤트 루프(Event Loop)에 대해 알아보자!](https://blog.naver.com/dlaxodud2388/222218703957)
