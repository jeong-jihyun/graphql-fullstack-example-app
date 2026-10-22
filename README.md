# graphql-fullstack-example-app

**지브리 영화 "명장면" 목록에 감상평과 좋아요를 남기는 GraphQL 풀스택 예제 앱**입니다. (2024-02~03, TypeScript)
서버(`server/`, Apollo GraphQL + TypeORM + MySQL + Redis)와 화면(`web/`, React + Chakra UI + Apollo Client)으로 나뉜 학습용 프로젝트입니다.

## 할 수 있는 것

| 기능 | 내용 |
| --- | --- |
| 영화·명장면 | 지브리 영화 목록(무한 스크롤용 페이지 조회), 영화 상세, 명장면(컷) 목록·상세 |
| 회원 | 회원가입, 로그인(액세스 토큰 + 리프레시 토큰 쿠키), 로그아웃, 내 정보(`me`), 토큰 갱신 |
| 감상평 | 명장면별 감상평 작성·수정·삭제 |
| 좋아요 | 명장면에 좋아요(투표) |
| 알림 | 알림 생성·조회, 실시간 새 알림(GraphQL 구독, 웹소켓) |

## 구성

| 구분 | 위치 | 기술 |
| --- | --- | --- |
| 서버 | `server/` | Node.js, TypeScript(ts-node), Apollo Server 3 + type-graphql, TypeORM, **MySQL**, **Redis**(ioredis), argon2(비밀번호 암호화), JWT, DataLoader |
| 화면 | `web/` | React 18, TypeScript, Chakra UI 2, Apollo Client 3, react-hook-form, react-router 6, GraphQL Code Generator |

```
graphql-fullstack-example-app/
├── server/
│   ├── src/apollo/        # Apollo 서버·스키마·구독 서버
│   ├── src/entities/      # DB 테이블 (User, CutVote, CutReview, Notification) + 영화 데이터 모델
│   ├── src/resolvers/     # Film, Cut, CutReview, User, Notification
│   ├── src/data/ghibli.ts # 지브리 영화·명장면 기본 데이터
│   └── .env.example       # 필요한 환경 변수 목록
└── web/
    └── src/
        ├── pages/         # Main, Film, Login, SignUp
        ├── components/    # 영화 카드, 명장면 목록·모달, 감상평, 로그인·가입 폼, 알림
        ├── graphql/       # 질의·변경 문서(.graphql)
        └── generated/     # 코드 생성기가 만든 타입 (직접 수정 금지)
```

## 실행 방법

### 준비물

- Node.js, Yarn
- MySQL 서버 (빈 데이터베이스 하나)
- Redis 서버 (기본 주소 `localhost:6379`)

### 1. 서버

```bash
cd server
cp .env.example .env     # DB 접속 정보와 JWT 비밀키를 채웁니다
yarn install
yarn start               # http://localhost:4000/graphql
```

### 2. 화면

```bash
cd web
yarn install
yarn start               # http://localhost:3000
```

| 명령 | 위치 | 설명 |
| --- | --- | --- |
| `yarn start` / `yarn dev` | server | 서버 실행 / 코드 수정 시 자동 재시작(nodemon) |
| `yarn start` | web | 개발 서버 |
| `yarn build` | web | 배포용 파일 생성 |
| `yarn test` | web | 테스트 실행 |
| `yarn codegen` | web | GraphQL 문서에서 타입 생성 (서버가 켜져 있어야 함) |

## 확인 내역 (2026-10)

| 점검 | 결과 |
| --- | --- |
| 서버 `yarn install --frozen-lockfile`, `tsc --noEmit` | 성공 (수정 후) |
| 웹 `yarn install --frozen-lockfile`, `yarn build`, `yarn test` | 성공 (경고 없음, 테스트 1개 통과) |
| 서버 실제 실행·화면 동작 | MySQL·Redis가 없는 환경이라 **실행해 보지 못했습니다** |

## 개선 내역 (2026-10)

| 구분 | 문제 | 수정 내용 |
| --- | --- | --- |
| 서버 실행 불가 | `cookie-parser`, `ws`의 타입 패키지가 없어 `ts-node`가 타입 오류(TS7016)로 시작 단계에서 중단 | `@types/cookie-parser`, `@types/ws` 추가(개발용) |
| 화면 오류 | 로그인 화면 제목 "지브리 명장면 프로젝트"가 `Stack` 안의 글자라 화면에 표시되지 않음 (Chakra `Stack`은 글자 자식을 그리지 않음). `fontSize`도 `4x1` 오타 | `Heading`으로 교체, `4xl`로 수정 (회원가입 화면의 같은 오타도 수정) |
| 테스트 실패 | `App.test.tsx`가 화면에 없는 "learn chakra"를 찾고 서버 연결이 필요해 항상 실패 | 서버 없이 확인 가능한 로그인 화면 테스트로 교체 |
| 경고 | 사용하지 않는 `INotification` 불러오기 | 제거 |
| 불필요한 파일 | `server/yarn-error.log`(105KB, 설치 오류 기록)가 저장소에 올라가 있음 | 삭제, `.gitignore`에 `.env`·`yarn-error.log` 추가 |
| 안내 | 서버 환경 변수 목록 없음 | `server/.env.example` 추가 (이름만, 값 없음) |

## ⚠ 보안 주의

- 과거 기록(커밋 `b527357` 등)에 `server/.env`가 올라간 적이 있고, 안에는 **DB 접속 정보와 JWT 비밀키 2개**가 들어 있었습니다. 지금은 삭제되었지만 **기록에는 남아 있습니다.** 같은 값을 실제 서비스에 쓴 적이 있다면 DB 비밀번호와 JWT 비밀키를 바꾸세요. (기록 자체를 지우려면 별도의 이력 정리 작업이 필요합니다.)
- `server/src/db/db-client.ts`의 주석에도 예전 접속 계정·비밀번호 예시가 남아 있습니다. 실제 값이면 지우고 바꾸세요.

## 앞으로 손보면 좋은 점

- `server/src/db/db-client.ts`의 `synchronize: true`는 코드 변경 시 DB 테이블을 자동으로 바꿉니다. 운영 환경에서는 끄고 마이그레이션을 쓰세요.
- 쿠키가 `secure: true`로 고정되어 있어 `http://localhost`에서는 일부 브라우저에서 로그인 쿠키가 저장되지 않을 수 있습니다.
- `server/`와 `web/`에 `package-lock.json`(npm)과 `yarn.lock`(yarn)이 함께 있고, `package-lock.json`은 `package.json`과 맞지 않습니다. yarn만 쓰고 `package-lock.json`은 지우는 것을 권장합니다.
- Redis 주소(`localhost`)가 코드에 고정되어 있습니다.
- 프로필 이미지 업로드 기능은 오류로 코드가 주석 처리되어 있습니다.
