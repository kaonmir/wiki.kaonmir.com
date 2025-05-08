---
title: 
aliases: 
tags:
  - 가지
---
([Source](https://wikidocs.net/223233))

Asynchronous event-driven 자바스크립트 런타임으로 브라우저 밖에서도 JS를 실행할 수 있도록 하는 런타임 환경.
## Overview
![https://www.simform.com/blog/what-is-node-js/](https://i.imgur.com/aeG3x45.jpeg)
(Source. https://www.simform.com/blog/what-is-node-js)

> Woker Threads = Thread Pool

1. 사용자는 `node index.js` 명령을 실행합니다.
2. [[#V8]]은 index.js 파일을 해석하고, 동기 작업은 직접 실행합니다.
3. **V8**는 비동기 작업을 네이티브 바인딩(C++로 변환)해 Libuv의 이벤트 루프로 보냅니다.[^1]
    1. [[#Libuv]]는 위임받은 작업을 커널의 비동기 syscall을 호출해 처리합니다. 만약 Kernel에 비동기 syscall이 없는 작업(DB, DNS, File I/O)이라면 스레드 풀에 푸시합니다.
    2. **Worker Thread**는 스레드 풀에서 작업을 pop해 동기적(sync)으로 실행합니다.
4. 작업이 완료되면 **Libuv**는 콜백 큐에 콜백 함수를 푸시합니다.
5. **Libuv의 Event Loop**는 V8의 콜스택이 비어 있다면(실행중인 코드가 없다면) 콜백 큐를 pop해 V8의 콜스택에 푸시합니다.
6. **V8**은 콜백 함수를 실행합니다.

### vs [[JVM]]
V8은 [[JVM]]과 흡사한 점이 많습니다.
1. **인터프리터 + JIT 컴파일러 조합**: 바이트코드를 인터프리트하며, 자주 호출되는 코드는 JIT 컴파일러(터보팬)가 기계어로 변환
2. **바이트코드 기반 실행**: 기계어로 바로 변환하지 않고 중간 코드(바이트코드)를 가상 머신이 실행.
    - JVM: Java 소스 코드 → `.class` 바이트코드 → JVM에서 실행.
    - V8: JavaScript 소스 코드 → Ignition 바이트코드 → V8 가상 머신에서 실행
3. **[[#V8 메모리 구조|메모리 구조]]와 가비지 컬렉션**: Heap을 Young/Old Generation으로 구분해 GC하는 방식

## V8
자바스크립트 코드를 실행하는 오픈 소스 엔진입니다.

![](https://i.imgur.com/EGzfgpT.png)
(Source. https://wikidocs.net/223219)

**구성 요소**
- **이그니션**: Interpreter. AST를 바이트코드로 변환합니다.
- **터보팬**: JIT 컴파일러. 바이트코드를 최적화해 기계어로 변환합니다

**동작 방식**
1. **파서**는 JS 코드를 AST(추상 구문 트리)로 변환합니다.
2. **이그니션**은 AST를 바이트코드로 변환환 후 실행합니다.
3. **터보팬**은 자주 호출되는 코드를 최적화해 기계어로 컴파일합니다. [^2][^3]
    - 터보팬이 컴파일한 기계어는 CPU에서 직접 실행합니다.
4. 객체의 구조나 타입이 바뀌면, V8은 해당 코드를 '최적화 해제'하여 바이트코드로 되돌립니다.
### V8 메모리 구조
([Source](https://jaehyeon48.github.io/javascript/memory-management-in-v8/)) #to-read

Heap과 GC의 동작은 [[JVM#Heap]]에 잘 설명되어 있습니다. 스택과 힙으로 구성됩니다.

![](https://i.imgur.com/mlPekgp.png)

([Source](https://deepu.tech/memory-management-in-v8/))

**힙(Heap)** 구조
- **Young Generation(New space)**: 새로 생성된 객체
- **Old Generation(Old Space)**: New Space에서 GC되지 않고 살아남은 객체
    - **Old Pointer Space** : 다른 객체를 참조하는 객체
    - **Old Data Space**: 데이터만 가지는 객체
- **Large Object Space**:  큰 객체(주로 128KB 이상[^4]). [[#mmap]] 메모리 영역에 할당됩니다. GC는 불필요한 객체를 삭제하되 객체를 이동하지는 않습니다.
- **Code Space**: [[#V8]] 터보팬이 컴파일한 코드
- **Cell/Property Cell/Map Space**: 각각 Cell, PropertyCell, Map 객체를 저장
    - **Cell**: 숫자, bool, null 등 자주 참조되지만 단순한 타입의 전역 변수, 상수 등
    - **PropertyCell**: 객체의 property나 클래스의 static 변수의 값을 저장
    - **Map**: 객체의 구조(prototype 등)을 설명하는 메타데이터 
 
## Libuv
파일, 네트워크 등 자바스크립트에 없는 기능을 제공하기 위한 C++ 이벤트 기반, 비동기 라이브러리입니다. 

Libuv는 비동기로 작업을 처리해야 합니다. 하지만 파일 시스템(read, write)이나 DNS 조회 같은 작업은 OS 레벨에서 비동기적으로 처리할 수 없습니다. 이런 작업들도 *비동기로 실행하는 것처럼* 보이도록 **스레드 풀**을 사용합니다. ([[#Overview]] 참조)

### Event Loop
Event Loop는 페이즈를 순회하며 각 큐에 있는 작업을 처리합니다. 비동기 작업은 하나의 페이즈에 속합니다.


![](https://i.imgur.com/IhV9Hbf.png)

**페이즈(Phase) 정리**

| 페이즈               | 용도                                            |
| ----------------- | --------------------------------------------- |
| Timer             | `setTimeout()`, `setInterval()`               |
| Pending Callbacks | 이전 루프에서 처리되지 못한 I/O 콜백을 실행                    |
| Idle, Prepare     | 내부 관리용                                        |
| Poll              | I/O 관련 이벤트(File I/O, 네트워크 등)                  |
| Check             | `setImmediate()`                              |
| Close Callbacks   | Close type의 이벤트 처리 (`.on('close', () => {})`) |

**특수 큐**
Phase와는 별도로 동작하는 특수 큐입니다. 페이즈 전환(tick)마다 큐가 모두 비워질 때까지 실행합니다. 일반적으로 **nextTickQueue → microTaskQueue → 다음 페이즈** 순으로 처리됩니다.

| Queue          | 설명                                                  |
| -------------- | --------------------------------------------------- |
| nextTickQueue  | `process.nextTick()`                                |
| microTaskQueue | `Promise.then()`, catch, finally, queueMicrotask 함수 |

---
## 부연설명
### mmap
Memory Mapping. 메모리의 특정 영역을 파일/디바이스에 매핑하는 syscall입니다. read/write syscall 대신 메모리를 읽고 쓰기 때문에 속도가 빠릅니다. OS가 자동으로 동기화하며, msync syscall로 강제 동기화할 수도 있습니다.

**주요 사용 방식**
- **파일 매핑**: 대용량 파일의 전체 또는 일부를 메모리에 올려 사용합니다.
- **IPC(프로세스 간 공유 메모리)**: 여러 프로세스가 같은 파일을 mmap해 데이터를 공유할 수 있습니다.
- **익명 매핑**: 파일 없이 메모리만 할당할 수 있습니다. node.js의 [[#V8 메모리 구조|LOS]]에서 이 방식을 사용해 대용량 객체를 저장합니다.

**mmap vs malloc**
mmap은 syscall이고 malloc은 C 표준 라이브러리입니다. malloc을 사용하면 [[C언어#메모리 영역|힙(Heap) 영역]]에 메모리를 할당하지만, mmap을 사용하면 **OS가 관리하는 별도의 가상 메모리 영역**에 메모리를 할당합니다.



[^1]: [libuv의 이벤트 루프(Event Loop)에 대해 알아보자!](https://blog.naver.com/dlaxodud2388/222218703957)

[^2]: [자바스크립트 이렇게 짜면 외않되? \| 올리브영 테크블로그](https://oliveyoung.tech/2023-10-28/oliveyoung-javascript-turbofan/)

[^3]: [V8 엔진의 과거, 현재 구조](https://velog.io/@dalbodre_ari/V8-%EC%97%94%EC%A7%84%EC%9D%98-%EA%B3%BC%EA%B1%B0-%ED%98%84%EC%9E%AC-%EA%B5%AC%EC%A1%B0)

[^4]: [Is there a limit for V8's "large object space"?](https://stackoverflow.com/questions/76740620/is-there-a-limit-for-v8s-large-object-space)
