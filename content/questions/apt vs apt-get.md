---
title:
aliases: []
tags: []
---
APT 와 apt-get는 내부적인 동작 차이는 거의 없다.
- apt : 가독성이 좋고, 사용자와 상호작용할 수 있도록 안내 메시지가 나옴
- apt-get : 좀더 세부적인 옵션과 스크립트 작성을 할 때 유리

Dockerfile 같은 script 파일에서 apt를 사용하면, `WARNING: apt does not have a stable CLI interface. Use with caution in scripts.` 경고문구가 나온다.

apt 명령어는 사용자와의 상호작용에 중점을 둔 CLI고, script내에서는 사용하기에는 주의가 필요하다는 것이므로, apt-get을 이용해서 사용한다.

**Sources.**
- [리눅스 패키지 비교 - 민한의 블로그](https://minhan2.tistory.com/entry/%EB%A6%AC%EB%88%85%EC%8A%A4-%ED%8C%A8%ED%82%A4%EC%A7%80-%EB%B9%84%EA%B5%90aptdpkgyumrpm)
