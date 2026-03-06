# 구리이단상담소 Frontend

신천지 관련 전문 상담 웹사이트의 프론트엔드 정적페이지입니다.

## 배포

해당 프로젝트는 chodae_recovery(private repo)의 frontend 부분을 sync한 프로젝트로, vercel에서 배포하고 있습니다.

chodae_recovery/frontend-nextjs 에서 git push 가 발생하면 자동으로 아래 페이지에 배포됩니다.

![구리이단상담소 프론트 개발페이지](https://frontend-public-beta.vercel.app/)

## 기술 스택

### Core
- **Next.js** 15.5.12 (App Router)
- **React** 19.0.0
- **TypeScript** 5.9.3

### Styling
- **Tailwind CSS** 4.x
- **Noto Sans KR** 폰트 (Google Fonts) - Pretendard 폰트 최적화 방법 확인중

### 상태 관리
- **Redux Toolkit** 2.5.0
- **React Redux** 9.2.0

### 유틸리티
- **Zod** 4.x - 폼 유효성 검사
- **dayjs** - 날짜 처리
- **lucide-react** - 아이콘
- **next-themes** - 다크/라이트 모드

### 테스트
- **Jest** 29.7.0
- **Testing Library** (React, Jest-DOM)

## 요구 사항

- **Node.js** 20.19.3

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 [http://localhost:499](http://localhost:499)에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### 테스트 실행

```bash
npm run test
```

### 린트 검사

```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── [section]/          # 동적 섹션 라우팅
│   ├── api/                # API Route Handlers
│   ├── login/              # 로그인 페이지
│   ├── signup/             # 회원가입 페이지
│   └── layout.tsx          # 루트 레이아웃
├── components/             # 재사용 가능한 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트 (Header, Navigation 등)
│   ├── theme/              # 테마 관련 컴포넌트
│   └── ui/                 # UI 컴포넌트 (FormInput, Button 등)
├── config/                 # 설정 파일 (네비게이션 등)
├── layouts/                # 레이아웃 Provider
├── lib/                    # 유틸리티 함수
│   ├── api.ts              # API 호출 함수
│   ├── date.ts             # 날짜 유틸리티
│   ├── useMediaQuery.ts    # 미디어 쿼리 훅
│   └── validations/        # Zod 스키마 (폼 유효성 검사)
├── store/                  # Redux 상태 관리
│   ├── authSlice.ts        # 인증 상태
│   ├── navigationSlice.ts  # 네비게이션 상태
│   └── themeSlice.ts       # 테마 상태
└── styles/                 # 전역 스타일
    ├── globals.css
    ├── animations.css
    └── scrollbar.css
```

## 주요 기능

- 📱 반응형 디자인 (모바일/데스크톱)
- 🌓 다크/라이트 모드 지원
- 🔐 사용자 인증 (로그인/회원가입)
- 📋 동적 콘텐츠 라우팅
- 🎨 Tailwind CSS 기반 스타일링

## 경로 별칭

`@/*` 경로 별칭을 사용하여 `src/` 디렉토리 내 파일을 임포트할 수 있습니다.

```typescript
import { fetchApi } from '@/lib/api';
import Header from '@/components/layout/Header';
```
