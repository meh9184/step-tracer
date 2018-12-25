# step-tracer
> 웹 페이지의 방문기록을 트리 모양으로 시각화 해주는 Whale Extension 입니다.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

기억하기 힘든 복잡한 방문기록, Step Tracer로 빠르게 접근하여 보다 편하게 웹 서핑을 즐겨보세요!


[주요 기능]
-Step Tracer 버튼 클릭 / Ctrl+Q : 웹 페이지 방문기록을 Tree 모양으로 시각화
-노드 클릭 : 해당 페이지로 이동
-노드에 마우스 오버 : 미리보기 화면 제공
-노드에 마우스 오버한 상태로 휠 스크롤 : 미리보기 화면 확대 / 축소
-url 링크에 마우스 우클릭 ->  ‘Step Tracer에 추가’ 클릭 : 새로운 노드 추가


[단축키]
-Windows
  -Ctrl+Q : 방문기록 트리 올림 / 내림
  -ESC : 방문기록 트리 내림
-Mac
  -Command+Shift+Y : 방문기록 트리 올림 / 내림
  -ESC : 방문기록 트리 내림


[아이콘 색깔]
-파란색 : 시작 페이지
-초록색 : 과거 페이지
-노란색 : 현재 페이지


[이렇게 사용해보세요]
-방문트리 단축키 Ctrl+Q 를, 탭 이동 단축키 Ctrl+Tab 과 병행하여 사용하면 편리합니다.


[이럴 때 사용해보세요]
-토익 시험 접수를 위해 네이버에 ‘토익’을 검색했는데, 자극적인 인기검색가 보일 때  
  -> 맘 편히 서핑한 후 방문기록 트리를 열어(Ctrl+Q) ‘토익 검색 결과’ 페이지로 다시 컴백  


- 네이버 스포츠 뉴스를 보다가 갑자기 과거에 방문했던 쇼핑몰 페이지를 찾아가고 싶을 때  
  -> 방문기록 트리를 열어(Ctrl+Q) 미리보기 화면으로 해당 페이지를 찾아 이동  


- 유튜브 영상을 보던 중 매력적인 추천 영상들이 여러 개 있을 때  
  -> 각 영상 링크 url 마다 마우스 우클릭 -> ‘Step Tracer에 추가’ 하여 현재 페이지의 후속 노드로 기록  


[주의 사항]
-웨일 새 탭 페이지(whale://newtab) 에서는 방문트리를 띄울 수 없습니다.
-단축키 Ctrl+Shift+Q 는 브라우저 종료 키입니다. 방문트리 단축키 Ctrl+Q를 사용할 때 조심해 주세요.
-방문트리의 생명주기는 탭의 생성부터 종료까지입니다. 탭을 한번 종료하면 다시 불러올 수 없으니 유의해주세요.
-네트워크 상태에 따라 미리보기 화면 캡처 타이밍이 늦어질 수 있습니다.
-아직 방문하지 않은 페이지의 미리보기 화면은 default 이미지로 대체됩니다.


[개발 진행중인 추가 기능]
-노드 아이콘 이미지/제목 편집 기능
-노드 삭제/추가 기능
-방문트리 저장 및 공유 기능
-탭 합병 기능


[Contact Point]
- meh9184@hanyang.ac.kr
- pmw9027@hanyang.ac.kr


![](../header.png)

## 설치 방법

OS X & 리눅스:

```sh
npm install my-crazy-module --save
```

윈도우:

```sh
edit autoexec.bat
```

## 사용 예제

스크린 샷과 코드 예제를 통해 사용 방법을 자세히 설명합니다.

_더 많은 예제와 사용법은 [Wiki][wiki]를 참고하세요._

## 개발 환경 설정

모든 개발 의존성 설치 방법과 자동 테스트 슈트 실행 방법을 운영체제 별로 작성합니다.

```sh
make install
npm test
```

## 업데이트 내역

* 0.2.1
    * 수정: 문서 업데이트 (모듈 코드 동일)
* 0.2.0
    * 수정: `setDefaultXYZ()` 메서드 제거
    * 추가: `init()` 메서드 추가
* 0.1.1
    * 버그 수정: `baz()` 메서드 호출 시 부팅되지 않는 현상 (@컨트리뷰터 감사합니다!)
* 0.1.0
    * 첫 출시
    * 수정: `foo()` 메서드 네이밍을 `bar()`로 수정
* 0.0.1
    * 작업 진행 중

## 정보

이름 – [@트위터 주소](https://twitter.com/dbader_org) – 이메일주소@example.com

XYZ 라이센스를 준수하며 ``LICENSE``에서 자세한 정보를 확인할 수 있습니다.

[https://github.com/yourname/github-link](https://github.com/dbader/)

## 기여 방법

1. (<https://github.com/yourname/yourproject/fork>)을 포크합니다.
2. (`git checkout -b feature/fooBar`) 명령어로 새 브랜치를 만드세요.
3. (`git commit -am 'Add some fooBar'`) 명령어로 커밋하세요.
4. (`git push origin feature/fooBar`) 명령어로 브랜치에 푸시하세요. 
5. 풀리퀘스트를 보내주세요.

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
