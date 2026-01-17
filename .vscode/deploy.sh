#!/bin/bash

# 원격 서버 배포 스크립트
# deploy-config.json 파일에서 설정을 읽어서 원격 서버로 배포합니다.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy-config.json"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 설정 파일 확인
if [ ! -f "$CONFIG_FILE" ]; then
    log_error "배포 설정 파일을 찾을 수 없습니다: $CONFIG_FILE"
    log_info "deploy-config.json.example 파일을 복사하여 deploy-config.json을 생성하고 설정을 입력하세요."
    exit 1
fi

# jq가 설치되어 있는지 확인
if ! command -v jq &> /dev/null; then
    log_error "jq가 설치되어 있지 않습니다."
    log_info "jq 설치: sudo apt install jq (Ubuntu/Debian) 또는 brew install jq (macOS)"
    exit 1
fi

# 설정 읽기
REMOTE_HOST=$(jq -r '.remote.host' "$CONFIG_FILE")
REMOTE_USER=$(jq -r '.remote.user' "$CONFIG_FILE")
REMOTE_PORT=$(jq -r '.remote.port // 22' "$CONFIG_FILE")
REMOTE_PATH=$(jq -r '.remote.projectPath' "$CONFIG_FILE")
SSH_KEY=$(jq -r '.remote.sshKeyPath // "~/.ssh/id_rsa"' "$CONFIG_FILE")

# 설정 검증
if [ "$REMOTE_HOST" == "null" ] || [ -z "$REMOTE_HOST" ] || [ "$REMOTE_HOST" == "your-server.com" ]; then
    log_error "원격 서버 호스트가 설정되지 않았습니다."
    exit 1
fi

if [ "$REMOTE_USER" == "null" ] || [ -z "$REMOTE_USER" ] || [ "$REMOTE_USER" == "username" ]; then
    log_error "원격 서버 사용자가 설정되지 않았습니다."
    exit 1
fi

if [ "$REMOTE_PATH" == "null" ] || [ -z "$REMOTE_PATH" ] || [ "$REMOTE_PATH" == "/home/username/chodae_recovery" ]; then
    log_error "원격 서버 프로젝트 경로가 설정되지 않았습니다."
    exit 1
fi

# SSH 키 경로 확장
SSH_KEY="${SSH_KEY/#\~/$HOME}"

# SSH 옵션 구성
SSH_OPTS="-p $REMOTE_PORT"
if [ -f "$SSH_KEY" ]; then
    SSH_OPTS="$SSH_OPTS -i $SSH_KEY"
fi

SSH_CMD="ssh $SSH_OPTS $REMOTE_USER@$REMOTE_HOST"
RSYNC_CMD="rsync -avz --delete -e \"ssh $SSH_OPTS\""

log_info "원격 서버 배포를 시작합니다..."
log_info "서버: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PORT"
log_info "경로: $REMOTE_PATH"

# 배포 타입 확인
DEPLOY_TYPE="${1:-full}"

# SSH 연결 정보 출력 함수 (다른 작업에서 사용)
get_ssh_info() {
    echo "$REMOTE_USER@$REMOTE_HOST"
    echo "$REMOTE_PORT"
    echo "$REMOTE_PATH"
    echo "$SSH_OPTS"
}

# SSH 명령 실행 함수
run_remote_command() {
    $SSH_CMD "$1"
}

case "$DEPLOY_TYPE" in
    "logs")
        log_info "원격 서버 로그 확인 중..."
        $SSH_CMD "cd $REMOTE_PATH/backend && docker-compose logs -f"
        ;;
    
    "status")
        log_info "원격 서버 상태 확인 중..."
        $SSH_CMD "cd $REMOTE_PATH/backend && docker-compose ps"
        ;;
    
    "shell")
        log_info "원격 서버에 접속합니다..."
        $SSH_CMD "cd $REMOTE_PATH/backend && bash"
        ;;
    "backend")
        log_info "백엔드만 배포합니다..."
        
        # 백엔드 파일 동기화
        log_info "백엔드 파일 동기화 중..."
        rsync -avz --delete -e "ssh $SSH_OPTS" \
            --exclude 'build/' \
            --exclude 'logs/' \
            --exclude '.gradle/' \
            --exclude 'node_modules/' \
            "$WORKSPACE_DIR/backend/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"
        
        # 원격 서버에서 Docker 재빌드 및 재시작
        log_info "원격 서버에서 Docker 컨테이너 재빌드 및 재시작 중..."
        $SSH_CMD "cd $REMOTE_PATH/backend && docker-compose up -d --build app"
        
        log_success "백엔드 배포가 완료되었습니다!"
        ;;
    
    "frontend")
        log_info "프론트엔드만 배포합니다..."
        
        # 프론트엔드 빌드 확인
        if [ ! -d "$WORKSPACE_DIR/frontend/dist" ]; then
            log_warning "프론트엔드 dist 디렉토리가 없습니다. 빌드를 먼저 실행하세요."
            exit 1
        fi
        
        # 프론트엔드 dist 동기화
        log_info "프론트엔드 빌드 파일 동기화 중..."
        rsync -avz --delete -e "ssh $SSH_OPTS" \
            "$WORKSPACE_DIR/frontend/dist/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend/dist/"
        
        # nginx 재시작
        log_info "Nginx 컨테이너 재시작 중..."
        $SSH_CMD "cd $REMOTE_PATH/backend && docker-compose restart nginx"
        
        log_success "프론트엔드 배포가 완료되었습니다!"
        ;;
    
    "full"|*)
        log_info "전체 프로젝트 배포합니다..."
        
        # 프론트엔드 빌드 확인
        if [ ! -d "$WORKSPACE_DIR/frontend/dist" ]; then
            log_warning "프론트엔드 dist 디렉토리가 없습니다. 빌드를 먼저 실행하세요."
            exit 1
        fi
        
        # 백엔드 파일 동기화
        log_info "백엔드 파일 동기화 중..."
        rsync -avz --delete -e "ssh $SSH_OPTS" \
            --exclude 'build/' \
            --exclude 'logs/' \
            --exclude '.gradle/' \
            --exclude 'node_modules/' \
            "$WORKSPACE_DIR/backend/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"
        
        # 프론트엔드 dist 동기화
        log_info "프론트엔드 빌드 파일 동기화 중..."
        rsync -avz --delete -e "ssh $SSH_OPTS" \
            "$WORKSPACE_DIR/frontend/dist/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend/dist/"
        
        # 원격 서버에서 Docker 재빌드 및 재시작
        log_info "원격 서버에서 Docker 컨테이너 재빌드 및 재시작 중..."
        $SSH_CMD "cd $REMOTE_PATH/backend && docker-compose up -d --build"
        
        log_success "전체 배포가 완료되었습니다!"
        ;;
esac

# 서비스 상태 확인
log_info "원격 서버 컨테이너 상태 확인 중..."
$SSH_CMD "cd $REMOTE_PATH/backend && docker-compose ps"

log_success "배포 프로세스가 완료되었습니다!"

