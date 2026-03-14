DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` varchar(100) NOT NULL,
    `username` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `nickname` varchar(100) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `church` varchar(150) DEFAULT NULL,
    `birthday` date DEFAULT NULL,
    `description` text,
    `level` varchar(20) DEFAULT 'general' COMMENT 'superadmin(슈퍼관리자), admin(관리자), general(일반사용자)',
    `upd_dt` varchar(50) DEFAULT NULL,
    `reg_dt` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `users` (`user_id`, `username`, `password`, `nickname`, `phone`, `church`,
 `birthday`,`description`, `level`, `upd_dt`, `reg_dt`) VALUES ('admin', 'admin', '$2a$10$MjfDnfKo/zcteaotzJNx2.
61v.vK1ktw5WDyzb50qTYm5W8AzwwF.','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', '2026-01-26', '2026-01-26');
INSERT INTO `users` (`user_id`, `username`, `password`, `nickname`, `phone`, `church`,
 `birthday`,`description`, `level`, `upd_dt`, `reg_dt`) VALUES ('sdhan', '한상대', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', '2026-01-26', '2026-01-26');
INSERT INTO `users` (`user_id`, `username`, `password`, `nickname`, `phone`, `church`,
 `birthday`,`description`, `level`, `upd_dt`, `reg_dt`) VALUES ('judahwon', '주다훤훤', '$2a$10$2jm/TC3qqdyxdjFAVeVULOHGqUFmnOht0sx1lnjJLXLX8EYKLxqIG','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', '2026-01-26', '2026-01-26');

-- 접속자 수 테이블 생성
DROP TABLE IF EXISTS `visitor_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `visitor_count` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `visit_date` date NOT NULL,
    `count` int(11) NOT NULL DEFAULT '0',
    `created_at` datetime DEFAULT NULL,
    `updated_at` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_visit_date` (`visit_date`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

-- 상담 글 테이블

DROP TABLE IF EXISTS `counseling_post`;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `counseling_post` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '번호',
    `title` varchar(255) NOT NULL COMMENT '제목',
    `content` text COMMENT '내용',
    `author_id` varchar(100) DEFAULT NULL COMMENT '작성자id',
    `author_name` varchar(100) NOT NULL COMMENT '작성자 이름',
    `phone` varchar(50) DEFAULT NULL COMMENT '연락처',
    `counsel_type` varchar(100) DEFAULT NULL COMMENT '상담 유형',
    `comment_count` int NOT NULL DEFAULT 0 COMMENT '댓글 개수',
    `private_num` int NOT NULL COMMENT 'private_num',
    `reg_dt` datetime DEFAULT NULL COMMENT '작성일자',
    `upd_dt` datetime DEFAULT NULL COMMENT '수정일자',
    PRIMARY KEY (`id`),
    KEY `idx_private_num` (`private_num`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 댓글 테이블
DROP TABLE IF EXISTS `counseling_comment`;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `counseling_comment` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '번호',
    `author_id` varchar(100) DEFAULT NULL COMMENT '작성자id',
    `author_name` varchar(100) NOT NULL COMMENT '작성자 이름',
    `content` text COMMENT '댓글 내용',
    `private_num` int NOT NULL COMMENT 'private_num (상담 글 참조)',
    `confirm` varchar(20) DEFAULT NULL COMMENT 'confirm',
    `reg_dt` datetime DEFAULT NULL COMMENT '작성일자',
    PRIMARY KEY (`id`),
    KEY `idx_private_num` (`private_num`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;


-- 6개 도메인(About, Board, Withdrawal, Prevention, Doctrine, ScjInfo) 테이블 생성
-- private_counseling, comments 테이블과 동일한 구조

DROP TABLE IF EXISTS `about_post`;
-- About
CREATE TABLE `about_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    private_num INT NOT NULL,
    reg_dt DATETIME,
    upd_dt DATETIME
);

DROP TABLE IF EXISTS `about_comment`;
CREATE TABLE `about_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);

-- Board
DROP TABLE IF EXISTS `board_post`;
CREATE TABLE `board_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    private_num INT NOT NULL,
    reg_dt DATETIME,
    upd_dt DATETIME
);

DROP TABLE IF EXISTS `board_comment`;
CREATE TABLE `board_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);

-- Withdrawal
DROP TABLE IF EXISTS `withdrawal_post`;
CREATE TABLE `withdrawal_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    private_num INT NOT NULL,
    reg_dt DATETIME,
    upd_dt DATETIME
);

DROP TABLE IF EXISTS `withdrawal_comment`;
CREATE TABLE `withdrawal_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);

-- Prevention
DROP TABLE IF EXISTS `prevention_post`;
CREATE TABLE `prevention_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    private_num INT NOT NULL,
    reg_dt DATETIME,
    upd_dt DATETIME
);

DROP TABLE IF EXISTS `prevention_comment`;
CREATE TABLE `prevention_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);

-- Doctrine
DROP TABLE IF EXISTS `doctrine_post`;
CREATE TABLE `doctrine_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    private_num INT NOT NULL,
    reg_dt DATETIME,
    upd_dt DATETIME
);

DROP TABLE IF EXISTS `doctrine_comment`;
CREATE TABLE `doctrine_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);

-- ScjInfo
DROP TABLE IF EXISTS `scj_info_post`;
CREATE TABLE `scj_info_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    private_num INT NOT NULL,
    reg_dt DATETIME,
    upd_dt DATETIME
);

DROP TABLE IF EXISTS `scj_info_comment`;
CREATE TABLE `scj_info_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);
