-- 500 에러 시: private_counseling, comments 테이블에 컬럼이 없을 수 있습니다.
-- 아래를 순서대로 실행하세요. "Duplicate column" 에러는 해당 컬럼이 이미 있다는 뜻이므로 무시하세요.

-- private_counseling
ALTER TABLE private_counseling ADD COLUMN content TEXT;
ALTER TABLE private_counseling ADD COLUMN phone VARCHAR(50);
ALTER TABLE private_counseling ADD COLUMN counsel_type VARCHAR(100);

-- comments
ALTER TABLE comments ADD COLUMN content TEXT;
ALTER TABLE comments ADD COLUMN reg_dt DATETIME;
