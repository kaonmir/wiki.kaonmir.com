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
2. [[#V8]]은 index.js 파일을 해석하고, 동기 작업은 메인 스레드에서 직접 실행합니다.
3. **V8**는 비동기 I/O(작업)을 네이티브 바인딩(C++로 변환)해 Libuv로 보냅니다.[^1]
    1. [[#Libuv]]는 위임받은 작업이 커널에서 비동기로 돌 수 있는지 미리 알고 있습니다. (커널마다 다 다름)
        1. **Non-blocking I/O**: 네트워크 소켓, 파일 디스크립터 등 커널이 비동기로 처리할 수 있는 작업은 비동기 인터페이스([[#epoll]], kqueue, 등)을 통해 처리됩니다.
        2. **Blocking I/O**: **Worker Thread**는 스레드 풀에서 작업을 pop해 동기적(sync)으로 실행합니다.
4. 작업이 완료되면 **Libuv**는 [[#이벤트 루프]]의 콜백 큐에 콜백 함수를 푸시합니다.
5. **Libuv의 Event Loop**는 V8의 콜스택이 비어 있을 때(실행중인 코드가 없다면) 콜백 큐를 pop해 메인 스레드에서 실행합니다.

## V8
자바스크립트 코드를 실행하는 오픈 소스 엔진입니다.

![](https://i.imgur.com/EGzfgpT.png)
(Source. https://wikidocs.net/223219)

V8은 [[JVM]]과 흡사한 점이 많습니다.
1. **인터프리터 + JIT 컴파일러 조합**: 바이트코드를 인터프리트하며, 자주 호출되는 코드는 JIT 컴파일러(터보팬)가 기계어로 변환
2. **바이트코드 기반 실행**: 기계어로 바로 변환하지 않고 중간 코드(바이트코드)를 가상 머신이 실행.
    - JVM: Java 소스 코드 → `.class` 바이트코드 → JVM에서 실행.
    - V8: JavaScript 소스 코드 → Ignition 바이트코드 → V8 가상 머신에서 실행
3. **[[#V8 메모리 구조|메모리 구조]]와 가비지 컬렉션**: Heap을 Young/Old Generation으로 구분해 GC하는 방식

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

### 이벤트 루프
페이즈를 순회하며 각 큐에 있는 작업을 처리하는 로직입니다. 각 비동기 작업은 하나의 페이즈에 속합니다. 각 페이지는 고유의 콜백 큐를 가지고 있습니다. 커널에서 syscall을 처리한 후, 반환된 콜백 함수를 페이즈에 맞춰 큐에 넣습니다.


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

### epoll
확장 가능한 I/O 이벤트 알림 메커니즘을 제공하는 리눅스 커널 syscall입니다. 다수의 파일 디스크립터(파일, 소켓)의 입출력 가능 여부를 감시합니다.  **O(1)** 시간 복잡도로 이벤트 감지가 가능하여, 감시 대상이 많아져도 성능 저하가 거의 없습니다. 

**핵심 구성 요소**
1. **레드-블랙 트리**: FD 등록 및 관리
2. **Ready List**: 이벤트가 발생한 FD만 보관
3. **소켓의 wait queue**: 이벤트를 기다리는 프로세스/스레드 목록

**동작 방식(이벤트 감지)**
> epoll이 소켓 데이터 도착을 감지하여 epoll_wait() 함수를 깨우는 과정을 예시로 듭니다.
1. 인터럽트 처리
    1. NIC가 패킷을 수신하면 **하드웨어 인터럽트**를 발생시킵니다. (자세한 건 [[아날로그 신호를 0과 1로 변환하는 방법?|여기로]])
    2. 인터럽트 핸들러가 해당 소켓의 수신 버퍼에 패킷 데이터를 저장합니다.
2. epoll의 ready list 업데이트
    1. 커널은 소켓의 이벤트 플래그가 구독 중인지 판단합니다.
    2. 해당 소켓을 epoll 인스턴스의 ready list에 추가합니다.
    3. 소켓의 wait queue에 등록된 프로세스를 깨웁니다.
3. `epoll_wait()` 동작
    1. 커널이 ready list에서 이벤트가 발생한 소켓 목록을 복사합니다.
    2. `epoll_wait()`가 깨어나며, 사용자 공간에 이벤트 정보를 반환합니다.

**이벤트 감지 시간이 O(1)인 이유는?**
- 인터럽트 핸들러는 이벤트가 발생한 FD를 그냥 알기 때문에, red-black tree를 조회하지 않고도 바로 FD를 ready list에 저장합니다. (**O(1)**)
- 커널은 전체 FD가 아닌 이벤트가 발생한 FD 목록( ready list)만 조회합니다. (**O(1)**)
- 커널은 `epoll_wait()`에게 ready list에서 FD 정보를 복사해 반환합니다. (**O(1)**)


[^1]: [libuv의 이벤트 루프(Event Loop)에 대해 알아보자!](https://blog.naver.com/dlaxodud2388/222218703957)

[^2]: [자바스크립트 이렇게 짜면 외않되? \| 올리브영 테크블로그](https://oliveyoung.tech/2023-10-28/oliveyoung-javascript-turbofan/)

[^3]: [V8 엔진의 과거, 현재 구조](https://velog.io/@dalbodre_ari/V8-%EC%97%94%EC%A7%84%EC%9D%98-%EA%B3%BC%EA%B1%B0-%ED%98%84%EC%9E%AC-%EA%B5%AC%EC%A1%B0)

[^4]: [Is there a limit for V8's "large object space"?](https://stackoverflow.com/questions/76740620/is-there-a-limit-for-v8s-large-object-space)
