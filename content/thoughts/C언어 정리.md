---
title:
aliases:
tags:
  - 가지
---


## 메모리 영역
1. **Code Area**
    - 함수, 상수, 리터럴 문자열 등 변경이 불가능한 데이터를 저장합니다.
    - 프로그램을 실행하면 실행한 파일의 명령어를 적재합니다.
    - 읽기 전용
2. **Data Area**
    - 전역 변수와 static 변수가 저장합니다.
    - 프로그램을 종료할 때 한 번에 해제되기 때문에 프로그램이 실행될 동안에는 값을 유지합니다.
3. **Stack Area**
    - 함수를 호출할 때 생성되는 **자동변수**, **매개변수**, 임시 데이터를 저장합니다.
4. **Heap Area**
    - 동적 할당(malloc)으로 사용자가 직접 관리하는 영역입니다.


![](https://imgur.com/Yu4rVcV.png)

## Storage Class
Storage class는 변수의 수명과 범위, 가시성을 정의하는 지정자입니다. 변수를 어디에 저장할지 얼마나 유지할지, 어떻게 접근할지 방법을 정합니다.
### auto
변수에 아무것도 지정하지 않았을 때 기본으로 지정되는 storage class입니다. 우리가 일반적으로 쓰는 변수는 모두 auto 변수이지요.
### static
함수의 범위 밖에서도 값을 유지하는 storage class입니다. 함수가 끝나면 제거되는 스택 영역에 저장하지 않고 프로그램이 끝날 때까지 사라지지 않는 데이터 영역에 저장합니다. 

```c
void counter() {
    static int count = 0;  
    count++;
    printf("%d\n", count);
}

int main() {
    counter(); // 1
    counter(); // 2
}
```

### extern
다른 파일에서 전역 변수를 참조하고 싶을 때 선언하는 변수입니다. 

### register
변수를 CPU 레지스터에 저장하도록 **컴파일러에 요청**하는 지정자입니다. 따라서 RAM에 저장하는 일반적인 변수들과 다르게 훨씬 빠르게 접근할 수 있습니다.

컴퓨터마다 레지스터 수와 크기는 모두 다릅니다. 컴파일러는 모든 변수를 register에 선언할 수 없기 때문에 이 요청을 거부할 수도 있습니다. register 변수는 메모리에 저장되지 않기 때문에 주소 연산자(&)를 사용할 수 없습니다.

요즘은 컴파일러 성능이 좋아져서 굳이 지정하지 않아도 알아서 레지스터를 최대한으로 사용하는 최적화를 한다고 합니다.

## 레지스터
register 지정자가 생소해서 검색하다 범용 레지스터라는 개념을 처음 봤네요. 아마 예전에 공부했었는데 까먹은 것이지 않을까 싶습니다.
### 레지스터 종류

[출처](https://en.wikibooks.org/wiki/X86_Assembly/X86_Architecture)

CPU 아키텍처마다 레지스터의 구성이 달라요. 여기서는 x86 32bit 기준으로 적습니다. 

> 범용 레지스터는 관행적인 용도가 명시되어 있지만 원하는대로 쓸 수 있습니다. 다만 ESP/RSP와 EBP/RBP는 스택 포인터라 잘못 건드리면 오류가 날 수 있습니다.

- 8 General-Purpose Registers (GPR)
    - ESP/RSP : 현재 스택의 최상단의 메모리 주소 지정
    - EBP/RBP : 현재 함수의 시작 메모리 주소 지정
- 6 Segment Registers
    - Stack Segment (SS)
    - Code Segment (CS)
    - Data Segment (DS)
    - Extra Segment (ES)
    - F Segment (FS)
    - G Segment (GS): 
- 1 Flags Register
- Instruction Pointer: 보통 **Program Counter(PC)** 라 불리는 그것