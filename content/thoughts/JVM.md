---
title: 
aliases: 
tags:
  - 씨앗
---
[[C언어 정리]]에 이어 JVM이 어떻게 동작하는지 알아보겠습니다. ([참고](https://velog.io/@sgwon1996/JAVA%EC%9D%98-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC%EC%99%80-JVM-%EA%B5%AC%EC%A1%B0))

Java Virtual Machine(JVM)은 추상 컴퓨팅 머신입니다. 실제 컴퓨팅 머신과 마친가지로 [명령어 집합](https://namu.wiki/w/%EB%AA%85%EB%A0%B9%EC%96%B4%20%EC%A7%91%ED%95%A9)을 가지고 있고, 런타임에 메모리 영역을 조작합니다.

> To implement the Java Virtual Machine correctly, you need only be able to read the `class` file format and correctly perform the operations specified therein.
> 
> [The Java® Virtual Machine Specification - Chapter 2](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)

## Overview


![](https://i.imgur.com/8fOBd6E.png)
1. 사용자가 `java -jar` 명령을 실행하면 JVM은 OS로부터 메모리를 할당받습니다.
2. **Class Loader**는 JAR 파일 내 `META-INF/MANIFEST.MF`에서 `Main-Class` 속성을 찾습니다.
3. **Class Loader**는 `Main-Class`와 의존성 클래스를 [[#Method Area]]에 로드합니다.
4. **Execution Engine**은 PC Register를 `main()`의 첫 번째 바이트코드 명령어 주소로 설정합니다.
5. **Execution Engine**은 Stack에 `main()`을 위한 [[#Frame]]을 할당하고 변수를 초기화합니다.
6. **Execution Engine**의 구성 요소인,
    - **Interpreter**는 `main()`의 첫 번째 바이트코드 명령부터 한 줄 씩 기계어로 해석합니 다.
    - **JIT**는 반복되는 메서드(루프 등)를 감지하고 최적화된 기계어로 해석하여 Method Area에 캐싱합니다.
7. **JVM**은 적절할 때 [[#Garbage Collector|GC]]를 실행하여 Heap 영역의 미참조 객체를 정리합니다.
## Run-Time Data Area

OS로 부터 할당받은 JVM의 메모리 영역으로, 자바 애플리케이션이 실행하는 동안 데이터를 저장하고 관리하는 영역입니다.


![](https://i.imgur.com/8CSvxgk.png)

### Method Area
[[C언어 정리|C언어의 코드 영역]]에 대응하는, 메타데이터와 바이트 코드(명령어)를 저장하는 데이터 영역입니다. (당연하게도) Method Area의 모든 정보는 클래스별로 관리됩니다.
- **클래스 메타데이터**: 클래스명, 부모 클래스 정보, 접근 제어자, 필드(멤버 변수)와 메서드의 이름·타입·시그니처.
- **바이트코드**: 컴파일된 메서드의 실행 코드.
- **정적 변수**: static으로 선언된 변수.
- **Runtime Constant Pool**
    - C언어와 달리 Java는 런타임에 동적으로 클래스를 로드할 수 있습니다. 그래서 컴파일할 때는 메소드의 실제 메모리 주소를 알 수 없어요. 코드를 실행해봐야만 알 수 있어요.
    - 그래서 메서드를 컴파일 때는 실제 메모리 주소 대신 symbolic reference를 저장합니다. (에, `java/lang/Object`)
    - Runtime Constant Pool은 런타임 중에 symbolic reference를 실제 메모리 주소에 매핑하는 테이블입니다.
### Heap
([Source](https://devocean.sk.com/blog/techBoardDetail.do?ID=165630&boardType=techBlog))

[[C언어 정리|C언어의 Heap 영역]]과 비슷하게 객체 인스턴스와 배열을 저장하는 데이터 영역입니다. `new` 연산자로 생성된 객체와 배열의 실제 데이터는 모두 여기에 저장합니다. Heap에 생성된 객체와 배열의 주소는 스택에 저장해 사용합니다.

![](https://i.imgur.com/HHEhbPI.png)
- **Young Generation**: 생명 주기가 짧은 객체
- **Old Generation**: 생명 주기가 긴 객체
- **Permananet Generation**: Deprecated, Metaspace로 변경[^1]

**내부 동작**
1. 객체를 생성하면 일단 **Eden**에 저장합니다.
2. Eden이 가득차면 Minor GC를 실행한다.
    1. Eden과 Survivor에서 참조되지 않는 객체를 삭제합니다.
    2. Eden의 객체와 Survivor 1의 객체를 합쳐 Survivor 2로 옮깁니다.[^2][^3] (한 번에 하나의 Survivor 영역을 번갈아가며 사용)
3. Minor GC에서 오래 살아남은 객체는 Old Generation으로 옮겨진다. 여기서 '오래'란?
    - 객체가 Minor GC에서 살아남은 횟수가  MaxTenuringThreshold 이상이거나
    - Survivor 영역의 메모리가 부족할 경우
4. Old Generation이 가득차면 Major GC를 실행한다.

### Thread
자바의 [[운영체제 04-thread|Thread]]는 실제 작업을 수행하는 최소 단위입니다.

- **PC Register**: 각 스레드에서 현재 실행중인 명령어 주소
- **Native Method Stack**: Java로 작성되지 않은 코드를 실행할 때 사용하는 스택
- **Java Virtual Machine Stack**: 지역 변수, 리턴 값 등을 저장하는 스택입니다. **[[#3.1. Frame|Frame]]** 단위로 저장합니다.
### Frame
Frame(Stack Frame)은 메서드 실행에 필요한 정보(지역 변수, 연산값, 리턴값 등)를 담은 메모리 블록입니다. 메서드가 실행될 때 생성하고, 메서드를 종료할 때 스택에서 제거합니다. 하나의 스레드에서 한 번에 하나의 프레임만 활성화할 수 있습니다.

**Stack Frame의 구조**
- **지역 변수**
- **Operand Stack**: 연산 수행을 위해 값을 임시로 저장하는 스택, 
- **Dynamic Links**: 실행중인 메서드를 참조하기 위한 Runtime Constant Pool의 메모리 주소
- **Return Address**: 메서드 끝나고 복귀할 바이트코드 명령어의 위치(offset)
- **Extra Information**

**메서드 종료 흐름**
- **Normal Method Invocation Completion**: 메서드를 정상 종료하는 상황
    - 호출자 프레임의 operand stack에 반환값을 저장합니다.
- **Abrupt Method Invocation Completion**: [예외](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.10)가 발생한 상황
    - 호출자 프레임에 예외 객체를 저장합니다.


### 참조

- [개발블로그 : 네이버 블로그](https://blog.naver.com/simjunbo/221080829920)

[^1]: Metaspace는 Method Area (JVM 스팩)을 구현하기 위해 실제 메모리가 할당된 영역을 의미한다. Non-heap이라고도 부른다. 그림은 모두 Heap이었던 시절의 그림으로 보인다.

[^2]: Survivor 1과 2를 번갈아가며 사용하는 이유는? 메모리 파편화 없이 살아남은 객체만 연속적으로 복사하기 위해서

[^3]: [GC를 하면 객체의 메모리 주소가 바뀌지 않나요?​​](https://stackoverflow.com/questions/15218438/after-gc-the-address-of-the-object-in-memory-be-changed-and-why-the-object-ref)
