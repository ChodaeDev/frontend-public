-- 기존 users 테이블에 level 컬럼 추가 (이미 컬럼이 있으면 에러 나므로 한 번만 실행)
ALTER TABLE users ADD COLUMN level VARCHAR(20) NOT NULL DEFAULT 'general' COMMENT 'superadmin, admin, general' AFTER descr;
-- 기존 admin 계정을 슈퍼관리자로 설정
UPDATE users SET level = 'superadmin' WHERE user_id = 'admin';
