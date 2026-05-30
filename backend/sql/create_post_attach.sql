CREATE TABLE IF NOT EXISTS `post_attach` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '첨부파일 ID',
    `board_table_name` varchar(100) NOT NULL COMMENT '게시판 테이블 이름',
    `post_id` int NOT NULL COMMENT '게시글 ID',
    `attach_order` int NOT NULL DEFAULT 0 COMMENT '파일 첨부 순서',
    `file_path` varchar(1024) NOT NULL COMMENT '파일경로(파일명 포함)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_post_attach_order` (`board_table_name`, `post_id`, `attach_order`),
    KEY `idx_post_attach_post` (`board_table_name`, `post_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
