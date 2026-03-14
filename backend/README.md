# Chodae Recovery Backend API

Spring Boot 3.5.x 기반의 REST API 서버입니다.

## 기술 스택

- **Java**: 21 LTS
- **Spring Boot**: 3.5.0
- **Spring Framework**: 6.2.x
- **Gradle**: 8.4
- **Database**: H2 (개발용)
- **Security**: Spring Security + JWT
- **Build Tool**: Gradle
- **Container**: Docker

## 프로젝트 구조

```
src/
├── main/
│   ├── java/com/chodae/
│   │   ├── ChodaeRecoveryApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   └── TestController.java
│   │   └── dto/
│   │       └── ApiResponse.java
│   └── resources/
│       ├── application.yml
│       └── application-docker.yml
└── test/
    └── java/com/chodae/
        └── ChodaeRecoveryApplicationTests.java
```

## 실행 방법

### 1. Docker를 사용한 실행 (권장)

```bash
# Docker 이미지 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

### 2. 로컬 개발 환경

```bash
# 프로젝트 빌드
./gradlew build

# 애플리케이션 실행
./gradlew bootRun

# JAR 파일로 실행
java -jar build/libs/chodae-recovery-0.0.1-SNAPSHOT.jar
```

## API 엔드포인트

### 공개 API (인증 불필요)
- `GET /api/public/health` - 서비스 상태 확인
- `GET /api/public/test` - API 테스트

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

### H2 데이터베이스 콘솔
- `http://localhost:8080/h2-console`

## API 설계

### 페이징 관련 정보
pageNumber: 현재 페이지
pageSize: 페이지네이션에 넣을 숫자 개수(보통 5개 또는 10개)
itemTotal: 데이터 전체 갯수
sorting: 우리끼리 정해봐야 함
itemCount: 한 페이징에서 표출할 데이터 갯수(보통 10개~50개 등)
totalPages: paging 전체 갯수


## Docker 환경

### 이미지 빌드
```bash
docker build -t chodae-recovery-api .
```

### 컨테이너 실행
```bash
docker run -p 8080:8080 chodae-recovery-api
```

### 환경 변수 설정
```bash
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JWT_SECRET=your-secret-key \
  chodae-recovery-api
```

## 개발 환경 설정

1. **Docker 설치** (권장)
2. **Java 21 설치** (로컬 개발용)
3. **IDE 설정** (IntelliJ IDEA, Eclipse, VS Code 등)
4. **Gradle Wrapper 사용** (프로젝트에 포함됨)

## CORS 설정

React 프론트엔드와의 연동을 위해 CORS가 설정되어 있습니다:
- 모든 Origin 허용 (개발용)
- GET, POST, PUT, DELETE, OPTIONS 메서드 허용
- 모든 헤더 허용

## 보안 설정

- JWT 기반 인증
- BCrypt 패스워드 암호화
- Stateless 세션 관리
- CSRF 비활성화 (REST API용)

## 다음 단계

1. 엔티티 클래스 생성
2. 리포지토리 인터페이스 생성
3. 서비스 클래스 구현
4. 컨트롤러 확장
5. JWT 인증 구현
6. 데이터베이스 스키마 설계
7. 프로덕션 데이터베이스 설정 (PostgreSQL, MySQL 등)
