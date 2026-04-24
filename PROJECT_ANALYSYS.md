# chodae_recovery 프로젝트 분석

## 1. 개요

`chodae_recovery`는 신천지 관련 상담/정보 제공 사이트를 위한 모노레포 형태의 프로젝트다.

- `backend`: Spring Boot 3.5 + MyBatis + Redis + MariaDB 기반 REST API
- `frontend-nextjs`: Next.js 15 App Router 기반 다국어 프론트엔드

코드 기준으로 보면, 백엔드는 게시판/콘텐츠 API 골격이 넓게 구현되어 있고, 프론트엔드는 다국어 라우팅과 인증, 상담게시판 중심 화면이 먼저 연결된 상태다.

## 2. 디렉터리 구조

```text
chodae_recovery/
├── backend/           # Spring Boot API 서버
├── frontend-nextjs/   # Next.js 프론트엔드
├── README.md
└── PROJECT_ANALYSIS.md
```

### backend 주요 구성

- `src/main/java/com/chodae/controller`
  - `about`, `scjinfo`, `doctrine`, `prevention`, `withdrawal`, `board`
  - `UserController`, `VisitorController`, `TestController`
- `src/main/java/com/chodae/service`
  - 도메인별 서비스 + 인증/세션/접속통계 서비스
- `src/main/java/com/chodae/mapper`
  - MyBatis Mapper 인터페이스
- `src/main/resources/mapper`
  - MyBatis SQL XML
- `docker-compose.yml`
  - 앱 + MariaDB + Redis + Nginx 구성

### frontend-nextjs 주요 구성

- `src/app/[locale]`
  - 다국어 라우팅 기준의 페이지 진입점
- `src/app/api/[...path]/route.ts`
  - 백엔드 프록시용 Route Handler
- `src/components/landing`
  - 메인 랜딩 섹션들
- `src/components/board`
  - 게시판 목록/상세/작성 UI
- `src/store`
  - Redux Toolkit 기반 인증/테마/네비게이션 상태
- `src/i18n`
  - 사전 파일과 로케일 설정

## 3. 기술 스택

### 백엔드

- Java 21
- Spring Boot 3.5.0
- Spring Security
- JWT
- MyBatis 3
- Spring Data Redis
- JPA 일부 사용
  - 방문자 집계 엔티티/리포지토리 계층에 사용
- MariaDB
- springdoc OpenAPI

### 프론트엔드

- Next.js 15.5.12
- React 19
- TypeScript 5.9
- Tailwind CSS 4
- Redux Toolkit
- Zod
- Jest + Testing Library

## 4. 아키텍처 요약

### 전체 흐름

1. 사용자는 `frontend-nextjs`에 접속한다.
2. Next.js middleware가 URL에 locale이 없으면 `ko`, `en`, `ja`, `zh`, `de` 중 하나로 리다이렉트한다.
3. 프론트는 API 호출 시 다음 두 방식 중 하나를 사용한다.
   - 브라우저에서 `NEXT_PUBLIC_API_URL` 기반 직접 호출
   - `/api/[...path]` 프록시를 통해 `BACKEND_URL`로 전달
4. 백엔드는 JWT + Redis 세션 검증으로 인증 상태를 처리한다.

### 인증 구조

- 회원가입/로그인 엔드포인트는 `POST /api/public/users/register`, `POST /api/public/users/login`
- 로그인 성공 시 JWT 발급
- Redis에는 `user_session:{userId}` 형태로 현재 유효한 `jti` 저장
- 이후 요청 시 `Authorization: Bearer <token>` 헤더로 인증
- 프론트는 `localStorage`에 `chodae_user`, `chodae_token` 저장

주의할 점:

- `SecurityConfig` 상 `/api/**`가 현재 `permitAll()`이라 스프링 시큐리티 차원에서는 대부분 열린 상태다.
- 실제 권한 체크는 각 컨트롤러에서 `Authentication` 유무와 `userId` 비교로 개별 처리한다.

## 5. 백엔드 구현 상태

### 5-1. 도메인 분류

백엔드는 아래 6개 콘텐츠 영역 + 공통 기능으로 구성된다.

- `about`
- `scjinfo`
- `doctrine`
- `prevention`
- `withdrawal`
- `board`
- 공통: `users`, `visitor`, `test`

### 5-2. API 패턴

여러 콘텐츠 영역이 거의 같은 패턴을 반복한다.

- `GET /list`
- `GET /detail/{id}`
- `GET /detail/{id}/comments`
- `POST /form`
- `POST /detail/{id}/comments`

게시판 영역에서는 여기에 수정/삭제가 일부 추가되어 있다.

- 상담게시판: 댓글 수정/삭제, 게시글 삭제 지원
- 자유게시판: 목록/상세/댓글/글 작성까지 구현

### 5-3. 데이터 계층

- 게시글/댓글 대부분은 MyBatis Mapper + XML 기반
- 방문자 통계는 JPA 엔티티/리포지토리 사용
- `AccessControlService`로 관리자 권한 여부를 확인해 일부 조회 권한 분기

### 5-4. 운영/배포 구성

`backend/docker-compose.yml` 기준:

- `app`: Spring Boot
- `db`: MariaDB 11.4.8
- `redis`: Redis 7
- `nginx`: reverse proxy

설정 파일은 다음 두 종류다.

- `application.yml`: 로컬 개발용, DB/Redis 모두 `localhost`
- `application-docker.yml`: Docker 환경용, DB=`db`, Redis=`redis`

## 6. 프론트엔드 구현 상태

### 6-1. 라우팅 구조

- `/[locale]`: 메인 페이지
- `/[locale]/login`
- `/[locale]/signup`
- `/[locale]/[section]`
- `/[locale]/[section]/[sub]`
- 상담게시판 전용 세부 페이지
  - `/[locale]/board/counseling/write`
  - `/[locale]/board/counseling/[id]`

### 6-2. 다국어 처리

- 지원 언어: `ko`, `en`, `ja`, `zh`, `de`
- middleware가 쿠키와 `Accept-Language`를 보고 locale 결정
- 사전 파일은 `src/i18n/dictionaries/*.json`

### 6-3. 현재 화면 구현 범위

실제 동작 기준으로 보면:

- 메인 랜딩 페이지: 구현됨
- 로그인/회원가입: 구현됨
- 상담게시판 목록/작성/상세: 구현 진행 중
- 일반 섹션 페이지: 라우팅과 서브메뉴는 구현됨
- 일반 섹션 실제 콘텐츠 렌더링: 대부분 미구현

근거:

- `SectionContent.tsx`에서 현재 `section === 'board'`일 때만 실제 컴포넌트를 렌더링
- 나머지 섹션은 `"서비스 준비중입니다."` 반환

즉, 백엔드의 `about`, `scjinfo`, `doctrine`, `prevention`, `withdrawal` API는 넓게 존재하지만, 프론트 메인 콘텐츠 연결은 아직 초기 단계다.

## 7. 데이터 흐름과 상태 관리

### 인증 상태

- Redux `authSlice`가 사용자 정보와 토큰을 관리
- 새로고침 이후 복원을 위해 `localStorage` 사용

### API 유틸

- `fetchApi()`
  - JSON 응답을 `{ success, data }` 형태로 해석
  - 토큰이 있으면 Authorization 자동 첨부
- `fetchWithAuth()`
  - 응답 구조를 강제하지 않는 단순 fetch 래퍼

### 게시판 UI

- 목록: `BoardContent`
- 테이블: `BoardTable`
- 작성: `CounselingWriteForm`
- 페이지네이션: `Pagination`

## 8. 코드 기준 주요 관찰 사항

### 8-1. 프론트/백엔드 라우트 불일치 가능성

`BoardContent.tsx`는 게시판 목록 조회 시 다음 경로를 사용한다.

- `/api/board/${sub}/list`

이 경우:

- `sub === counseling`이면 `/api/board/counseling/list`로 맞음
- `sub === free`이면 `/api/board/free/list`가 되는데, 백엔드는 `/api/freeboard/list`

즉 자유게시판은 현재 프론트와 백엔드의 엔드포인트가 맞지 않을 가능성이 높다.

### 8-2. 보안 설정이 느슨함

`SecurityConfig`에서 `/api/**` 전체를 `permitAll()`로 열어두고 있다.

- 장점: Swagger 테스트와 초기 개발은 편함
- 단점: 보안 책임이 컨트롤러 내부 로직으로 분산됨

운영 전에는 최소한 인증이 필요한 경로를 Spring Security 레벨에서 다시 분리하는 편이 안전하다.

### 8-3. README와 실제 구현 사이 차이

문서상 일부 설명은 현재 코드와 다르다.

- 백엔드 README에는 H2 개발 DB가 언급되지만 실제 `application.yml`은 MariaDB 사용
- 프론트 README는 “정적 페이지” 성격을 설명하지만 실제로는 로그인/회원가입/게시판/프록시 API까지 포함

즉 현재 프로젝트는 README보다 구현 범위가 넓고, 일부 설명은 갱신이 필요하다.

### 8-4. 랜딩 페이지 일부 데이터는 아직 목업

메인 페이지에서 통계값은 현재 하드코딩되어 있다.

- `stats = { yearlyCount: 150, totalCount: 2750 }`

방문자 API가 이미 있으므로 이후 연동 가능성이 높다.

### 8-5. 검색 기능은 UI만 있고 백엔드 연동 미완성

`BoardContent.tsx`에 제목/작성자 검색 UI가 있으나 코드에 `TODO: API에 검색 파라미터 추가`가 있다.

즉 검색 UX는 보이지만 실제 조회 조건 반영은 아직 미완성이다.

## 9. 현재 프로젝트의 강점

- 백엔드 도메인 분류가 비교적 명확함
- 다국어 라우팅 기반이 이미 잡혀 있음
- JWT + Redis 단일 세션 제어 구조가 구현되어 있음
- 게시글/댓글 CRUD 패턴이 여러 섹션에 재사용 가능하게 정리되어 있음
- Docker Compose로 로컬 통합 실행이 가능함

## 10. 현재 프로젝트의 과제

- 프론트에서 비게시판 섹션 API 연결 부족
- 자유게시판 경로 불일치 가능성 정리 필요
- 보안 정책을 컨트롤러 의존형에서 설정 기반으로 정리할 필요
- README와 실제 코드 상태 동기화 필요
- 검색, 랜딩 통계, 상세 페이지 등 일부 기능이 아직 목업/부분 구현 상태

## 11. 추천 정리 방향

우선순위를 잡으면 아래 순서가 적절하다.

1. 프론트 API 경로와 백엔드 엔드포인트를 전수 대조
2. `SectionContent`에 각 섹션 실제 API 연동 추가
3. 인증 필요 API를 `SecurityConfig`에서 명시적으로 보호
4. 랜딩/게시판의 목업 데이터를 실 API로 대체
5. README를 현재 구조 기준으로 다시 작성

## 12. 한 줄 결론

이 프로젝트는 "백엔드 API 골격은 넓게 갖춰졌고, 프론트는 다국어/인증/상담게시판 중심으로 먼저 구축된 상태"이며, 다음 단계는 프론트 실제 콘텐츠 연동과 보안/문서 정리다.
