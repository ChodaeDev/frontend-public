# Docker 설치 및 사용 가이드

## Docker 설치

### Ubuntu/WSL 환경에서 Docker 설치

```bash
# 패키지 업데이트
sudo apt update

# 필요한 패키지 설치
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Docker의 공식 GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker 저장소 추가
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Windows에서 Docker Desktop 설치

1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) 다운로드
2. 설치 파일 실행
3. WSL 2 백엔드 사용 권장
4. 설치 완료 후 재부팅

## 프로젝트 실행

### 1. Docker Compose로 전체 스택 실행

`backend/docker-compose.yml`은 Frontend(Next.js), Backend(Spring Boot), MariaDB, Redis, Nginx를 함께 실행합니다.

```bash
cd backend
# 개발 환경 실행
docker compose up --build

# 백그라운드 실행
docker compose up -d --build

# 로그 확인
docker compose logs -f

# 중지
docker compose down
```

접속 포트:

- Frontend 직접 접속: http://localhost:4998
- Nginx 프록시: http://localhost
- Backend API: http://localhost:8080

### 2. 개별 이미지 빌드

```bash
# 백엔드 이미지
cd backend
docker build -t chodae-recovery-api .

# 프론트엔드 이미지
cd ../frontend-nextjs
docker build -t chodae-recovery-frontend .
```

### 3. 백엔드 컨테이너 단독 실행

```bash
# 컨테이너 실행
docker run -p 8080:8080 chodae-recovery-api

# 환경 변수와 함께 실행
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JWT_SECRET=your-secret-key \
  chodae-recovery-api
```

## 유용한 Docker 명령어

```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 로그 확인
docker logs <container_id>

# 컨테이너 내부 접속
docker exec -it <container_id> /bin/bash

# 이미지 목록 확인
docker images

# 사용하지 않는 리소스 정리
docker system prune
```

## 문제 해결

### 권한 문제
```bash
# docker 그룹에 사용자 추가 후 재로그인 필요
sudo usermod -aG docker $USER
# 터미널 재시작 또는 재로그인
```

### 포트 충돌
```bash
# 8080 포트 사용 중인 프로세스 확인
sudo netstat -tulpn | grep :8080

# 다른 포트로 실행
docker run -p 8081:8080 chodae-recovery-api
```

### 디스크 공간 부족
```bash
# Docker 시스템 정리
docker system prune -a
```
