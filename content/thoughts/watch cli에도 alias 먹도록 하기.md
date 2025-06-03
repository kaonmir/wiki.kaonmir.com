---
title: 
aliases: 
tags:
  - 씨앗
  - 꿀팁
---
**문제점**  
기본적으로 `watch` 명령어는 쉘의 alias(별칭)를 인식하지 못합니다. 예를 들어, `ll`을 `ls -lh`로 alias 해두었더라도 `watch ll`을 실행하면 `ll: not found`와 같은 에러가 발생합니다[1](https://kimmj.github.io/ubuntu/use-alias-in-watch/).

**해결 방법: watch 자체를 alias로 감싸기**
가장 간단하고 널리 쓰이는 방법은 `watch` 명령어 자체를 alias로 재정의하는 것입니다.  
아래와 같이 설정 파일(예: `~/.zshrc` 또는 `~/.bashrc`)에 다음 라인을 추가합니다.

```bash
alias watch='watch '
```

이렇게 하면 `watch` 뒤에 오는 명령어가 alias로 등록된 명령어라도 올바르게 해석되어 실행됩니다.
