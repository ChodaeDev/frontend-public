# Chodae Recovery

> The Chodae dev team, united in Christ, includes SD, JH, DH, and YL.

![mainpage](./mainpage.png)

신천지 관련 상담/정보 제공 사이트를 위한 모노레포 프로젝트입니다.

## 프로젝트 URL

- 운영계
http://182.222.129.4:4998

- API 문서
http://182.222.129.4:4998/v3/api-docs

- Swagger UI
http://182.222.129.4:4998/swagger-ui/index.html

## 프로젝트 구조

```
chodae_recovery/
├── backend/           # Spring Boot 3.5 + MyBatis + MariaDB REST API
├── frontend/   # Next.js 15 App Router + Tailwind v4
├── .githooks/         # Git commit-msg hook
└── history.md         # 작업 일지
```

## 기술 스택

### Backend
- Java 21, Spring Boot 3.5, MyBatis
- MariaDB, Redis
- JWT 인증

### Frontend
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4, Zustand, TanStack Query
- 다국어 지원 (ko, en, ja, zh, de)
- Node >= 20

## 시작하기

### Backend

```bash
cd backend
./gradlew bootRun
```

### Frontend

```bash
cd frontend-nextjs
npm install
npm run dev      # http://localhost:499
```

## Git 설정

### Hook 활성화 (최초 1회)

커밋 메시지 컨벤션을 자동 검증하는 hook이 포함되어 있습니다. 클론 후 프로젝트 루트에서 아래 명령어를 실행해주세요.

```bash
git config core.hooksPath .githooks
```

### 커밋 메시지 컨벤션

```
<접두사>: <내용 (~한다)>
```

**허용 접두사**

| 접두사 | 용도 |
|---|---|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | UI/스타일 변경 |
| `refactor` | 코드 리팩토링 |
| `docs` | 문서 수정 |
| `test` | 테스트 추가/수정 |

**예시**

```
feat: 상담게시판 댓글 기능을 추가한다
fix: 모바일 입력 시 자동 확대를 방지한다
style: 댓글 수정 버튼 레이아웃을 변경한다
refactor: CommentSection을 별도 컴포넌트로 분리한다
docs: README에 커밋 컨벤션을 추가한다
```

### 브랜치 전략 (권장)

기능 단위로 브랜치를 생성하고 PR로 머지합니다.

```
feat/<기능명>       # 기능 개발
fix/<버그명>        # 버그 수정
refactor/<대상>     # 리팩토링
```

**예시**

```
feat/press-board
fix/mobile-scroll
refactor/comment-section
```
