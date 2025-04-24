---
title:
aliases: []
tags: []
---

### 유형
- tracing : 메모리, 스택 등 실제 자원에 직접 접근
- networking : [[NIC]]에서 온 패킷을 조작
### BPF 프로그램
- **SOCKERT_FILTER** : raw [[소켓]]에 부착되어 모든 패킷에 접근 (읽기 전용)
- **KPROBE** : [[커널]]의 특정 호출 지점들에 동적으로 부착할 수 있는 함수를 총칭
- **TRACEPOINT** : 추적점(커널 코드에 있는 정적 표식) 처리기
- **XDP** : 네트워크 패킷이 커널에 도착한 초기 시점에 실행, 패킷 전달 여부를 반환
- **PERF** : pref(커널 내부 성능 프로파일러)에 부착, 성능 자료 분석 작업을 할 수 있다.
- **CGROUP_SKB**(Socker Buffer) : [[cgroup]]에 속한 프로세스 안에서 네트워크 트래픽 제어
- **CGROUP_SOCK** : 새 소켓을 여는 작업을 통제 (트래픽을 제어하지는 않는다)
- **SOCK_OPS** : 소켓 연결의 [[생명주기]] 마다 실행돼 패킷 만료 시간 등의 옵션을 설정
- **SK_SKB**(Socket Map) : 소켓 맵(묶음)에 접근하고 소켓을 redirect할 수 있다. 부하 분산에 사용
- **CGROUP_DEVICE** : cgroup 내 프로세스들의 장치를 제어. 권한 관리를 주로 한다.
- **SK_MSG** : 소켓 맵 안의 소켓에 전달되는 모든 메시지의 전달 여부를 반환
- **RAW_TRACEPOINT** : 그냥 TRACEPOINT 보다 더 자세하며 성능 부하가 있음
- **CGROUP_SOCK_ADDR** : cgruop 내 프로세스가 사용하는 [[IP 주소]]와 [[포트]]를 조작
- **SK_REUSEPORT** : 커널이 포트를 재사용할지 여부 반환
- **FLOW_DISSECTOR** : 내장 흐름 분할기(네트워크 패킷을 계층별로 관리)를 제어해 패킷 처리


**See also.**
- Type here

**Sources.**
- Type here


