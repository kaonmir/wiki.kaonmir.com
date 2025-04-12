---
title: "노션에서 Git까지, 자동화 여정"
date: 2023-07-04T06:35:30+09:00
author: Sunghun Son
summary: "최근 회사 블로그에서 왜, 그리고 어떻게 노션에서 작성한 글을 GitLab까지 자동으로 커밋하는지 설명했습니다. 이번 포스팅에서는 좀 더 디테일한 여정을 그려보려 합니다."
keywords: ["노션", "GitLab", "자동화", "DevOps", "AWS Lambda", "AWS SAM", "서버리스"]
tags: ["기술"]
pin: true
mermaid: true
---

최근 회사 블로그 [내부 개발자 포털로 업무 자동화하기](https://insight.infograb.net/blog/2023/06/24/infograb-idp)에서 어떻게 노션에서 작성한 글을 GitLab까지 자동으로 커밋하는지 설명했습니다. 그리고 내부 개발자 포털의 필요성을 언급했죠. 노션이 대세가 된 지금, 정말 많은 사람들이 저와 같은 고민을 할 건데요. 이번 포스팅에서는 좀 더 디테일한 여정을 그려보려 합니다.

사실 저는 백엔드 개발자가 아닙니다. 프로필에도 적혀 있듯이 DevOps 엔지니어에요. 그리고 이번 프로젝트는 생전 처음으로 AWS Lambda로 개발했습니다. 그래서 아직 프레임워크나 폴더 구조는 고민하고 있는 상황입니다.

저는 다같이 고민을 하는 자리를 만들고 싶습니다. 더 나은 아이디어는 언제나 환영이니 댓글에 남겨주세요. 같이 이야기하고 고민해보아요. Shy하시면 메일 주셔도 좋아요!

## 블로그 포스팅 프로세스 스케치하기

"**노션에서 Git**"까지의 여정을 아래처럼 간략하게 표현했습니다.

1. 입력 검증하기 (Validation)
2. Git 정보 가져오기 (GitLab 아이디)
3. 노션에서 마크다운과 이미지 가져오기
4. 마크다운을 변형하기(frontmatter, 이미지 경로 등)
5. 이슈와 풀 리퀘스트 만들기
6. Git에 커밋, 푸시하기

막상 이렇게 나열하니까 별 게 없어 보이지 않나요?

## 아키텍처

{{< mermaid >}}
flowchart LR
    B[Handler] --> C[Usecase]
    C --> D[Component]
    D --> E[Service]
    C --> E
    D --> F[Data]
{{</ mermaid >}}

### Handler

핸들러(Handler) 계층은 유저의 요청을 받아들이는 부분입니다. 많은 백엔드 프레임워크에서 컨트롤러(Controller)라고 부르는데요. 어떤 백엔드 프레임워크를 사용하여 핸들러를 구현해도 상관없습니다. 여러분 마음이에요. 저는 지금은 AWS SAM(Serverless Application Model)을 이용해 만들었습니다. 하지만 추후 애플리케이션의 규모가 커진다면 핸들러를 NestJS로 교체할 예정이에요.

코드는 무척이나 간단한데요. 유저의 입력을 받아 검증하고 usecase를 호출한 후 결과를 반환하면 끝입니다.

### Usecase

유스케이스(Usecase) 계층은 전체 프로세스를 작성하는 부분입니다. `블로그 포스팅`, `블로그 업데이트` 등 우리가 하고 싶은 하나의 큰 작업을 말하는데요. 애플리케이션의 정체성을 결정하기 때문에 가장 중요하고 섬세하게 설계해야 합니다.

처음 정리한 블로그 포스팅 프로세스는 아래 코드처럼 만들 수 있습니다.

{{< highlight typescript >}}
class PostBlogUsecase {
  run() {
    this.extractGitLabInfo(...)
    this.validate(...)
    this.extractNotion(...)
    this.manipulateNotion(...)
    this.createIssueAndMR(...)
    this.commitAndPush(...)
  }

  extractGitLabInfo(...) {}
  validate(...) {}
  extractNotion(...) {}
  manipulateNotion(...) {}
  createIssueAndMR(...) {}
  commitAndPush(...) {}
}
{{</ highlight >}}

처음 작성한 프로세스와 판박이지 않나요? 아, **입력 검증하기**와 **Git 정보 가져오기**가 바뀐 것 같다면 착각이 아닙니다. 이슈나 풀 리퀘스트가 정상적인지를 검증하려면 미리 Git 정보를 가져와야 하기 때문에 조금 바꿨습니다.

이제 각각의 단계를 상세히 풀어갈 차례입니다.

### Service

서비스(Service) 계층은 외부 서비스(노션, GitLab)를 사용하기 위해 API를 함수로 만들어놓은 부분입니다. 사실 대부분 유명한 API는 라이브러리로 만들어져 있습니다. 하지만 비공식 API를 사용하거나 기존의 API를 개선해서 사용하고 싶을 때가 있습니다.

예를 들어, 노션의 [마크다운을 추출하는 API](https://notebooks.githubusercontent.com/view/ipynb?browser=chrome&color_mode=auto&commit=05a8ff58c059f41e8662addd6cec4402eea96d24&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a6b656c6c65797274702f6e6f74696f6e2d6170692f303561386666353863303539663431653836363261646464366365633434303265656139366432342f4e6f74696f6e4150492e6970796e62&logged_in=false&nwo=jkelleyrtp%2Fnotion-api&path=NotionAPI.ipynb&repository_id=158154615&repository_type=Repository&version=104)는 비공식이기 때문에 라이브러리에서 지원하지 않습니다. 또한 비공식 API를 사용하더라도 마크다운을 가져오는 방법은 매우 복잡합니다. 이와 같이 서비스는 API를 가공해서 우리가 원하는 아주 단순한 작업을 만드는 단계입니다. 물론 단순한 작업을 만들기 위해 복잡한 로직을 사용할 수 있어요 :)

**노션에서 마크다운을 추출**하는 150줄 소스코드 가운데 핵심 부분을 소개합니다.

{{< highlight typescript "hl_lines=2 7" >}}
async exportCollection(blockId: string): Promise<string> {
  const { taskId } = await this.enqueueTaskExportCollection(blockId, this.spaceId);
  if (!taskId) throw new Error('Notion enqueueTaskExportCollection failed; taskId is undefined');

  let response: ResultExportBlockResponse | undefined = undefined;
  for (let i = 0; i < 15; i++) {
    response = await this.getTasksExportCollection([taskId]);
    if (!response) throw new Error('Notion getTasksExportCollection failed');
    if (response.results[0].state === 'success') break;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (!response) throw new Error('Notion exportCollection failed');
  else if (response.results[0].state !== 'success')
    throw new Error('Notion exportCollection failed' + response.results);
  else return response.results[0].status.exportURL;
}
{{</ highlight >}}

### Component

컴포넌트(Component) 계층은 유스케이스에서 공통으로 사용하는 로직을 모아놓은 부분입니다. 유스케이스와 서비스의 중간 단계라고 할 수 있어요. 사실 처음에는 이 계층이 없었습니다. 그러다가 유스케이스가 자꾸 많아지니 공통 로직을 모을 필요를 느꼈고 그렇게 만들어진 계층입니다.

컴포넌트의 예시로는 어떤 것들이 있을까요?

- 노션에서 마크다운을 추출한 다음에는 반드시
  1. 압축을 풀고,
  2. 이미지를 적절한 경로로 옮기고,
  3. 마크다운에 바뀐 이미지 경로를 다시 적어야 합니다.

- 노션 데이터베이스에 있는 정보를 이용하려면
  1. 노션 ID를 바탕으로 메타데이터를 불러오고,
  2. 조건에 맞게 유효성 검사를 한 후,
  3. 지정된 타입으로 변환해야 합니다.

### Data

데이터(Data) 계층은 오늘 만들긴 했습니다만, 저는 내부 개발자 포털과 GitLab을 매핑하는 용도로 사용하고 있습니다. 회사에서 쓰는 Port(내부 개발자 포털)는 유저와 GitLab을 연동하는 기능이 없습니다. 하지만 누가 커밋했는지를 알기 위해서는 반드시 GitLab 아이디가 필요합니다. 그래서 Port 아이디와 GitLab 아이디를 매핑한 JSON 파일을 데이터 계층에 두었습니다.

## 유스케이스 클래스 다이어그램

{{< mermaid >}}
classDiagram
  direction RL
  class Usecase~Properties~{
      #Port port
      #GitLab gitlab
      #Notion notion
      +run(Properties)
  }

  class Blog {
    +"POST" | "UPDATE" type
    +run()
    -extractGitLabInfo()
    -validate()
    -extractNotion()
    -manipulateNotion()
    -createIssueAndMR()
    -commitAndPush()
  }

  Usecase <|-- Blog
  Blog <|-- PostBlog
  Blog <|-- UpdateBlog
  Blog <|-- PostTraining
  Blog <|-- UpdateTraining

  namespace Usecases {
    class Usecase
    class Blog
    class PostBlog
    class UpdateBlog
    class PostTraining
    class UpdateTraining
  }

  class BlogFactory {
    +create() Usecase
  }

  BlogFactory --> Usecase

{{</ mermaid >}}

위 그림은 유스케이스를 설계한 클래스 다이어그램입니다. 그림이 조금 복잡하죠? 팩토리 패턴을 사용해 클래스를 설계했는데요. 디자인 패턴이 익숙하지 않으신 분들은 [팩토리 메서드 패턴](https://refactoring.guru/ko/design-patterns/factory-method)을 참고해주시기 바랍니다.

### 추상 클래스를 만든 이유

저희 회사는 여러 마크다운 사이트를 운영하고 있습니다. 블로그용, 공식 문서용, 교육용 등등이죠. 각각의 사이트는 비슷하지만 구조가 모두 다릅니다. 따라서 하나의 유스케이스를 재활용할 수는 없고 조금씩 변형해야 합니다. 하지만 큰 프로세스는 모두 처음 정리한 것처럼 동일합니다.

이러한 비슷하지만 다른 유스케이스를 관리하기 위해 Blog 추상 클래스를 만들었습니다. 가장 메인이 되는 프로세스는 Blog 클래스의 run 메서드에 정의합니다. 그리고 나머지 세부 함수들은 각각 하위 클래스에서 구현하도록 합니다. 이렇게 하면 각 유스케이스에 맞게 세부 사항을 조정할 수 있습니다. 아울러 변하지 않는 큰 프로세스는 Blog, 한 곳에서 관리할 수 있게 됩니다.

### 팩토리 패턴을 적용하기

유스케이스는 핸들러 계층에서 사용하잖아요? 기본적으로 모든 유스케이스는 각자의 핸들러를 가져야 합니다.

하지만 동작 원리가 똑같고, 어떤 상황에서 어떤 유스케이스를 사용해야 할지가 명확하다면 분리할 필요가 없습니다. 분리하지 않고 깔끔하게 하나의 핸들러에서 관리할 수 있습니다. 이를 위해 팩토리 패턴을 사용합니다.

팩토리 패턴은 (포스팅 혹은 업데이트)인지, (Blog 혹은 Training)인지를 구분해 상황에 맞는 객체를 만듭니다. 반환은 run 메서드만 가진 Usecase 클래스를 사용합니다. 따라서 핸들러 입장에서는 그저 run만 실행하고, 실제로 어떤 유스케이스가 동작하는지는 알 필요가 없습니다.

핸들러를 코드로 표현하면 아래와 같습니다.

{{< highlight typescript "hl_lines=8-10" >}}
export const handler = async (event) => {
  // 입력값 검사
  const actionType = ... // POST or UPDATE
  const serviceId =  ... // 블로그 사이트의 고유값

  // 유스케이스 실행
  const blogFactory = new BlogFactory();
  return blogFactory
    .create(actionType, serviceId)
    .run({ input })
    .then(() => new Response('Succeeded!'))
    .catch((e) => new Response('Failed!'));
};
{{</ highlight >}}

## 마치며

지금까지 **노션에서 Git까지 자동화 여정**을 따라가 보았습니다. 내용이 좀 많고 어려울 수 있습니다. 그렇지만 저 또한 같이 공부를 하는 입장으로서 이 글이 여러분에게 조금이마나 인사이트를 주었으면 좋겠습니다.

모두 귀찮음을 해소하기 위해 '노력'해서 자동화를 해봐요 :)
