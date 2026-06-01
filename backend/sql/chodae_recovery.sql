/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

DROP TABLE IF EXISTS `post_attach`;
DROP TABLE IF EXISTS `comment`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `visitor_log`;
DROP TABLE IF EXISTS `visitor_count`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `userName` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `nickName` varchar(50) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `church` varchar(100) DEFAULT NULL,
    `birthday` date DEFAULT NULL,
    `description` text,
    `level` enum('self', 'family', 'friend', 'etc', 'admin', 'superadmin') DEFAULT 'self' COMMENT 'self(스스로), family(가족), friend(친구), etc(기타)',
    `modified_date` datetime DEFAULT NULL,
    `create_date` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`, `birthday`, `description`, `level`, `modified_date`, `create_date`)
VALUES
    ('admin', 'admin', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae', 'admin', '01012345678', 'admin', '2026-01-26', 'admin', 'superadmin', NOW(), NOW()),
    ('sdhan', '한상대', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae', 'admin', '01012345678', 'admin', '2026-01-26', 'admin', 'superadmin', NOW(), NOW()),
    ('sdhan2', '한상대2', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae', 'admin', '01012345678', 'admin', '2026-01-26', 'admin', 'superadmin', NOW(), NOW()),
    ('judahwon', '주다훤', '$2a$10$2jm/TC3qqdyxdjFAVeVULOHGqUFmnOht0sx1lnjJLXLX8EYKLxqIG', 'admin', '01012345678', 'admin', '2026-01-26', 'admin', 'superadmin', NOW(), NOW());

-- 접속자 수 테이블 (일별 누계)
DROP TABLE IF EXISTS `visitor_count`;
CREATE TABLE `visitor_count` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `visit_date` date NOT NULL,
    `count` int unsigned NOT NULL DEFAULT '0',
    `created_at` datetime DEFAULT NULL,
    `updated_at` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_visit_date` (`visit_date`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 접속자 로그 테이블 (IP, 국가/지역, 세션별 상세)
DROP TABLE IF EXISTS `visitor_log`;
CREATE TABLE `visitor_log` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
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

-- 통합 게시글 테이블
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '게시글 ID',
    `main_menu` enum('board', 'about', 'scj_info', 'doctrine', 'prevention', 'withdrawal') NOT NULL COMMENT '상위 메뉴',
    `sub_menu` varchar(50) NOT NULL COMMENT '하위 메뉴',
    `visibility_level` enum('public', 'partial', 'private') NOT NULL DEFAULT 'public' COMMENT 'public(공개)/partial(본인+관리자)/private(제보+관리자)',
    `counsel_type` enum('self', 'family', 'friend', 'etc') DEFAULT NULL COMMENT '상담 유형',
    `title` varchar(255) NOT NULL COMMENT '제목',
    `content` text COMMENT '내용',
    `user_id` varchar(50) DEFAULT NULL COMMENT '작성자 ID',
    `user_name` varchar(50) NOT NULL COMMENT '작성자 이름',
    `phone` varchar(20) DEFAULT NULL COMMENT '연락처',
    `email` varchar(100) DEFAULT NULL COMMENT '이메일',
    `comment_count` smallint unsigned NOT NULL DEFAULT 0 COMMENT '댓글 개수',
    `is_notice` tinyint(1) NOT NULL DEFAULT 0 COMMENT '공지 여부',
    `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '삭제 여부',
    `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일자',
    `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일자',
    PRIMARY KEY (`id`),
    KEY `idx_post_menu` (`main_menu`, `sub_menu`),
    KEY `idx_post_visibility` (`visibility_level`),
    KEY `idx_post_user` (`user_id`),
    KEY `idx_post_create_date` (`create_date`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 통합 댓글 테이블
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '댓글 ID',
    `post_id` int unsigned NOT NULL COMMENT '게시글 ID',
    `parent_comment_id` int unsigned DEFAULT NULL COMMENT '부모 댓글 ID(1단계 대댓글)',
    `content` text NOT NULL COMMENT '댓글 내용',
    `user_id` varchar(50) DEFAULT NULL COMMENT '작성자 ID',
    `user_name` varchar(50) NOT NULL COMMENT '작성자 이름',
    `visibility_level` enum('public', 'partial', 'private') NOT NULL DEFAULT 'public' COMMENT 'public(공개)/partial(본인+관리자)/private(제보+관리자)',
    `confirm` varchar(20) DEFAULT NULL COMMENT '처리/확인 상태',
    `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '삭제 여부',
    `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일자',
    `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일자',
    PRIMARY KEY (`id`),
    KEY `idx_comment_post` (`post_id`),
    KEY `idx_comment_parent` (`parent_comment_id`),
    KEY `idx_comment_user` (`user_id`),
    KEY `idx_comment_create_date` (`create_date`),
    CONSTRAINT `fk_comment_post`
        FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_comment_parent`
        FOREIGN KEY (`parent_comment_id`) REFERENCES `comment` (`id`)
        ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 게시글 첨부파일 테이블
DROP TABLE IF EXISTS `post_attach`;
CREATE TABLE `post_attach` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '첨부파일 ID',
    `post_id` int unsigned NOT NULL COMMENT '게시글 ID',
    `attach_order` smallint unsigned NOT NULL DEFAULT 0 COMMENT '파일 첨부 순서',
    `file_path` varchar(1024) NOT NULL COMMENT '파일경로(파일명 포함)',
    `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '삭제 여부',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_post_attach_order` (`post_id`, `attach_order`),
    KEY `idx_post_attach_post` (`post_id`),
    CONSTRAINT `fk_post_attach_post`
        FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
        ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
