---
title: 
aliases: 
tags:
  - 가지
---
Kernel Execute, 현재 실행 중인 커널에서 새로운 커널을 부팅할 수 있도록 하는 리눅스 커널 매커니즘. [[리눅스 시스템 부팅 과정|전통적인 부팅 과정]] (전원 공급/펌웨어/부트로더 등)을 거치지 않고 커널에서 커널로 '빠르게[^1]' 바로 이동합니다.

### 동작 방식[^2]

1. kexec은 kexec_load() 시스템 콜[^3]을 호출해 새 커널 이미지(vmlinuz)와 초기 RAM 디스크(initrd)를 메모리에 로드합니다.
2. 기존 커널은 하드웨어를 안전하게 정지(suspend)합니다.
3. 기존 커널은 CPU 제어권을 새 커널로 이전합니다.[^4]
4. 새 커널은 자체 초기화 루틴을 실행합니다.

[^1]: 6배 빠르다고 합니다. ([Oracle 블로그](https://blogs.oracle.com/linux/post/reboot-faster-with-kexec))
[^2]: [linux/arch/arm64/kernel/machine\_kexec.c at master · torvalds/linux](https://github.com/torvalds/linux/blob/master/arch/arm64/kernel/machine_kexec.c)
[^3]: [Kdump, A Kexec-based Kernel Crash Dumping Mechanism](https://www.kernel.org/doc/ols/2005/ols2005v1-pages-177-188.pdf)
[^4]: [linux/arch/arm/kernel/relocate\_kernel.S at torvalds/linux](https://github.com/torvalds/linux/blob/b6ea1680d0ac0e45157a819c41b46565f4616186/arch/arm/kernel/relocate_kernel.S#L61)

