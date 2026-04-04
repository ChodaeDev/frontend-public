DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` varchar(100) NOT NULL,
    `userName` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `nickName` varchar(100) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `church` varchar(150) DEFAULT NULL,
    `birthday` date DEFAULT NULL,
    `description` text,
    `level` varchar(20) DEFAULT 'general' COMMENT 'superadmin(슈퍼관리자), admin(관리자), general(일반사용자)',
    `modified_date` varchar(50) DEFAULT NULL,
    `create_date` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES ('admin', 'admin', '$2a$10$MjfDnfKo/zcteaotzJNx2.
61v.vK1ktw5WDyzb50qTYm5W8AzwwF.','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', '2026-01-26', '2026-01-26');
INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES ('sdhan', '한상대', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', '2026-01-26', '2026-01-26');
INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES ('judahwon', '주다훤', '$2a$10$2jm/TC3qqdyxdjFAVeVULOHGqUFmnOht0sx1lnjJLXLX8EYKLxqIG','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', '2026-01-26', '2026-01-26');

-- 접속자 수 테이블 (일별 누계)
DROP TABLE IF EXISTS `visitor_count`;
CREATE TABLE `visitor_count` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `visit_date` date NOT NULL,
    `count` int(11) NOT NULL DEFAULT '0',
    `created_at` datetime DEFAULT NULL,
    `updated_at` datetime DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_visit_date` (`visit_date`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 접속자 로그 테이블 (IP, 국가/지역, 세션별 상세)
DROP TABLE IF EXISTS `visitor_log`;
CREATE TABLE `visitor_log` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `session_id` varchar(64) NOT NULL COMMENT '세션 식별자 (현재 접속자 추적용)',
    `ip_address` varchar(45) NOT NULL COMMENT '공인 IP (IPv4/IPv6)',
    `country` varchar(100) DEFAULT NULL COMMENT '국가',
    `region` varchar(150) DEFAULT NULL COMMENT '지역/도시',
    `visit_at` datetime NOT NULL COMMENT '최초 방문 시각',
    `last_activity_at` datetime NOT NULL COMMENT '마지막 활동 시각 (현재 접속자 판단용)',
    PRIMARY KEY (`id`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_visit_at` (`visit_at`),
    KEY `idx_last_activity_at` (`last_activity_at`),
    KEY `idx_ip_address` (`ip_address`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- (user_session은 Redis로 운영. DB 테이블 불필요)

-- 상담 글 테이블

DROP TABLE IF EXISTS `counseling_post`;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `counseling_post` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '번호',
    `user_id` varchar(100) DEFAULT NULL COMMENT '작성자id',
    `user_name` varchar(100) NOT NULL COMMENT '작성자 이름',
    `title` varchar(255) NOT NULL COMMENT '제목',
    `content` text COMMENT '내용',
    `phone` varchar(50) DEFAULT NULL COMMENT '연락처',
    `email` varchar(50) DEFAULT NULL COMMENT '이메일',
    `counsel_type` varchar(100) DEFAULT NULL COMMENT '상담 유형',
    `comment_count` int DEFAULT NULL DEFAULT 0 COMMENT '댓글 개수',
    `is_private` int DEFAULT NULL COMMENT 'is_private',
    `create_date` datetime DEFAULT NULL COMMENT '작성일자',
    `modified_date` datetime DEFAULT NULL COMMENT '수정일자',
    PRIMARY KEY (`id`),
    KEY `idx_is_private` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

insert into counseling_post (user_id, user_name, title, content, phone, email, counsel_type, comment_count, is_private, create_date, modified_date) values ('admin', '관리자', '상담요청1', '탈퇴희망1', '01012345678', 'admin@admin.com', 'general', 0, 0, now(), now()),
('sdhan', '한상대', '상담요청2', '탈퇴희망2', '01012345678', 'sdhan@sdhan.com', 'general', 0, 0, now(), now()),
('judahwon', '주다훤', '상담요청3', '탈퇴희망3', '01012345678', 'judahwon@judahwon.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청4', '탈퇴희망4', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청5', '탈퇴희망5', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청6', '탈퇴희망6', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청7', '탈퇴희망7', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청8', '탈퇴희망8', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청9', '탈퇴희망9', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청10', '탈퇴희망10', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청11', '탈퇴희망11', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청12', '탈퇴희망12', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청13', '탈퇴희망13', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청14', '탈퇴희망14', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청15', '탈퇴희망15', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청16', '탈퇴희망16', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청17', '탈퇴희망17', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청18', '탈퇴희망18', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청19', '탈퇴희망19', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청20', '탈퇴희망20', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청21', '탈퇴희망21', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청22', '탈퇴희망22', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청23', '탈퇴희망23', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청24', '탈퇴희망24', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청25', '탈퇴희망25', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청26', '탈퇴희망26', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청27', '탈퇴희망27', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청28', '탈퇴희망28', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청29', '탈퇴희망29', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청30', '탈퇴희망30', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청31', '탈퇴희망31', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청32', '탈퇴희망32', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청33', '탈퇴희망33', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청34', '탈퇴희망34', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청35', '탈퇴희망35', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청36', '탈퇴희망36', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청37', '탈퇴희망37', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청38', '탈퇴희망38', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청39', '탈퇴희망39', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청40', '탈퇴희망40', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청41', '탈퇴희망41', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청42', '탈퇴희망42', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청43', '탈퇴희망43', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청44', '탈퇴희망44', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청45', '탈퇴희망45', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청46', '탈퇴희망46', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청47', '탈퇴희망47', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청48', '탈퇴희망48', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청49', '탈퇴희망49', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청50', '탈퇴희망50', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청51', '탈퇴희망51', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청52', '탈퇴희망52', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청53', '탈퇴희망53', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청54', '탈퇴희망54', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청55', '탈퇴희망55', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청56', '탈퇴희망56', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청57', '탈퇴희망57', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청58', '탈퇴희망58', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청59', '탈퇴희망59', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청60', '탈퇴희망60', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청61', '탈퇴희망61', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청62', '탈퇴희망62', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청63', '탈퇴희망63', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청64', '탈퇴희망64', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청65', '탈퇴희망65', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청66', '탈퇴희망66', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청67', '탈퇴희망67', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청68', '탈퇴희망68', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청69', '탈퇴희망69', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청70', '탈퇴희망70', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청71', '탈퇴희망71', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청72', '탈퇴희망72', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청73', '탈퇴희망73', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청74', '탈퇴희망74', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청75', '탈퇴희망75', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청76', '탈퇴희망76', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청77', '탈퇴희망77', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청78', '탈퇴희망78', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청79', '탈퇴희망79', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청80', '탈퇴희망80', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청81', '탈퇴희망81', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청82', '탈퇴희망82', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청83', '탈퇴희망83', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청84', '탈퇴희망84', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청85', '탈퇴희망85', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청86', '탈퇴희망86', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청87', '탈퇴희망87', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청88', '탈퇴희망88', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청89', '탈퇴희망89', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청90', '탈퇴희망90', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청91', '탈퇴희망91', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청92', '탈퇴희망92', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청93', '탈퇴희망93', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청94', '탈퇴희망94', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청95', '탈퇴희망95', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청96', '탈퇴희망96', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청97', '탈퇴희망97', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청98', '탈퇴희망98', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청99', '탈퇴희망99', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('hyunsoo', '현수', '상담요청100', '탈퇴희망100', '01012345678', 'hyunsoo@hyunsoo.com', 'general', 0, 0, now(), now()),
('jisu', '지수', '상담요청101', '탈퇴희망101', '01012345678', 'jisu@jisu.com', 'general', 0, 0, now(), now());


-- 댓글 테이블
DROP TABLE IF EXISTS `counseling_comment`;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `counseling_comment` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '번호',
    `post_id` int NOT NULL COMMENT '상담 글 id',
    `user_id` varchar(100) DEFAULT NULL COMMENT '작성자id',
    `user_name` varchar(100) NOT NULL COMMENT '작성자 이름',
    `content` text COMMENT '댓글 내용',
    `is_private` int DEFAULT NULL COMMENT 'is_private (상담 글 참조)',
    `confirm` varchar(20) DEFAULT NULL COMMENT 'confirm',
    `create_date` datetime DEFAULT NULL COMMENT '작성일자',
    `modified_date` datetime DEFAULT NULL COMMENT '수정일자',
    PRIMARY KEY (`id`),
    KEY `idx_is_private` (`is_private`)
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
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    is_private INT DEFAULT NULL,
    create_date DATETIME,
    modified_date DATETIME
);

DROP TABLE IF EXISTS `about_comment`;
CREATE TABLE `about_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    content TEXT,
    is_private INT DEFAULT NULL,
    confirm VARCHAR(20),
    create_date DATETIME
);

-- Board
DROP TABLE IF EXISTS `freeboard_post`;
CREATE TABLE `freeboard_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    is_private INT DEFAULT NULL,
    create_date DATETIME,
    modified_date DATETIME
);

DROP TABLE IF EXISTS `freeboard_comment`;
CREATE TABLE `freeboard_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    content TEXT,
    is_private INT DEFAULT NULL,
    confirm VARCHAR(20),
    create_date DATETIME
);

-- Withdrawal
DROP TABLE IF EXISTS `withdrawal_post`;
CREATE TABLE `withdrawal_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    is_private INT DEFAULT NULL,
    create_date DATETIME,
    modified_date DATETIME
);

DROP TABLE IF EXISTS `withdrawal_comment`;
CREATE TABLE `withdrawal_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    content TEXT,
    is_private INT DEFAULT NULL,
    confirm VARCHAR(20),
    create_date DATETIME
);

-- Prevention
DROP TABLE IF EXISTS `prevention_post`;
CREATE TABLE `prevention_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    is_private INT DEFAULT NULL,
    create_date DATETIME,
    modified_date DATETIME
);

DROP TABLE IF EXISTS `prevention_comment`;
CREATE TABLE `prevention_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    content TEXT,
    is_private INT DEFAULT NULL,
    confirm VARCHAR(20),
    create_date DATETIME
);

-- Doctrine
DROP TABLE IF EXISTS `doctrine_post`;
CREATE TABLE `doctrine_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    is_private INT DEFAULT NULL,
    create_date DATETIME,
    modified_date DATETIME
);

DROP TABLE IF EXISTS `doctrine_comment`;
CREATE TABLE `doctrine_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    content TEXT,
    is_private INT DEFAULT NULL,
    confirm VARCHAR(20),
    create_date DATETIME
);

-- ScjInfo
DROP TABLE IF EXISTS `scj_info_post`;
CREATE TABLE `scj_info_post` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    counsel_type VARCHAR(100),
    comment_count INT NOT NULL DEFAULT 0,
    is_private INT DEFAULT NULL,
    create_date DATETIME,
    modified_date DATETIME
);

DROP TABLE IF EXISTS `scj_info_comment`;
CREATE TABLE `scj_info_comment` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    content TEXT,
    is_private INT DEFAULT NULL,
    confirm VARCHAR(20),
    create_date DATETIME
);
