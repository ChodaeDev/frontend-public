-- 사용자 테이블 테스트 데이터
INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES
('admin', 'admin', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae','admin', '01012345678', 'admin', '2026-01-26', 'admin','superadmin', NOW(), NOW());
INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES ('sdhan', '한상대', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', NOW(), NOW());
INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES ('sdhan2', '한상대2', '$2a$10$ACg9VFvqJmEox321TPhjyO6Ms3ZA5HAZkN42b85e9QBdt3yaP.1ae','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', NOW(), NOW());
INSERT INTO `users` (`user_id`, `userName`, `password`, `nickName`, `phone`, `church`,
 `birthday`,`description`, `level`, `modified_date`, `create_date`) VALUES ('judahwon', '주다훤', '$2a$10$2jm/TC3qqdyxdjFAVeVULOHGqUFmnOht0sx1lnjJLXLX8EYKLxqIG','admin', '01012345678', 'admin', '2026-01-26', 'admin',
'superadmin', NOW(), NOW());

-- 통합 게시글 테이블 테스트 데이터
INSERT INTO `post` (`main_menu`, `sub_menu`, `visibility_level`, `counsel_type`, `title`, `content`, `user_id`, `user_name`, `phone`, `email`, `comment_count`, `is_notice`, `is_deleted`, `create_date`, `modified_date`) VALUES
('board', 'counseling', 'partial', 'self', '상담요청1', '탈퇴희망1', 'admin', '관리자', '01012345678', 'admin@admin.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청2', '탈퇴희망2', 'sdhan', '한상대', '01012345678', 'sdhan@sdhan.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'family', '상담요청3', '탈퇴희망3', 'judahwon', '주다훤', '01012345678', 'judahwon@judahwon.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'family', '상담요청4', '탈퇴희망4', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'family', '상담요청5', '탈퇴희망5', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'friend', '상담요청6', '탈퇴희망6', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'friend', '상담요청7', '탈퇴희망7', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'friend', '상담요청8', '탈퇴희망8', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'etc', '상담요청9', '탈퇴희망9', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'etc', '상담요청10', '탈퇴희망10', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청11', '탈퇴희망11', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청12', '탈퇴희망12', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청13', '탈퇴희망13', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청14', '탈퇴희망14', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청15', '탈퇴희망15', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청16', '탈퇴희망16', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청17', '탈퇴희망17', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청18', '탈퇴희망18', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청19', '탈퇴희망19', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청20', '탈퇴희망20', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청21', '탈퇴희망21', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청22', '탈퇴희망22', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청23', '탈퇴희망23', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청24', '탈퇴희망24', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청25', '탈퇴희망25', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청26', '탈퇴희망26', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청27', '탈퇴희망27', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청28', '탈퇴희망28', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청29', '탈퇴희망29', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청30', '탈퇴희망30', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청31', '탈퇴희망31', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청32', '탈퇴희망32', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청33', '탈퇴희망33', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청34', '탈퇴희망34', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청35', '탈퇴희망35', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청36', '탈퇴희망36', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청37', '탈퇴희망37', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청38', '탈퇴희망38', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청39', '탈퇴희망39', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청40', '탈퇴희망40', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청41', '탈퇴희망41', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청42', '탈퇴희망42', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청43', '탈퇴희망43', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청44', '탈퇴희망44', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청45', '탈퇴희망45', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청46', '탈퇴희망46', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청47', '탈퇴희망47', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청48', '탈퇴희망48', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청49', '탈퇴희망49', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청50', '탈퇴희망50', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청51', '탈퇴희망51', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청52', '탈퇴희망52', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청53', '탈퇴희망53', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청54', '탈퇴희망54', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청55', '탈퇴희망55', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청56', '탈퇴희망56', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청57', '탈퇴희망57', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청58', '탈퇴희망58', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청59', '탈퇴희망59', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청60', '탈퇴희망60', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청61', '탈퇴희망61', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청62', '탈퇴희망62', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청63', '탈퇴희망63', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청64', '탈퇴희망64', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청65', '탈퇴희망65', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청66', '탈퇴희망66', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청67', '탈퇴희망67', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청68', '탈퇴희망68', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청69', '탈퇴희망69', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청70', '탈퇴희망70', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청71', '탈퇴희망71', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청72', '탈퇴희망72', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청73', '탈퇴희망73', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청74', '탈퇴희망74', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청75', '탈퇴희망75', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청76', '탈퇴희망76', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청77', '탈퇴희망77', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청78', '탈퇴희망78', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청79', '탈퇴희망79', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청80', '탈퇴희망80', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청81', '탈퇴희망81', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청82', '탈퇴희망82', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청83', '탈퇴희망83', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청84', '탈퇴희망84', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청85', '탈퇴희망85', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청86', '탈퇴희망86', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청87', '탈퇴희망87', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청88', '탈퇴희망88', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청89', '탈퇴희망89', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청90', '탈퇴희망90', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청91', '탈퇴희망91', 'jisu', '지수', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청92', '탈퇴희망92', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청93', '탈퇴희망93', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청94', '탈퇴희망94', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청95', '탈퇴희망95', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청96', '탈퇴희망96', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청97', '탈퇴희망97', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청98', '탈퇴희망98', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청99', '탈퇴희망99', 'hyunsoo', '현수', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청100', '탈퇴희망100', 'sdhan', '한상대', '01012345678', 'hyunsoo@hyunsoo.com', 0, 0, 0, now(), now()),
('board', 'counseling', 'partial', 'self', '상담요청101', '탈퇴희망101', 'judahwon', '주다훤', '01012345678', 'jisu@jisu.com', 0, 0, 0, now(), now());

-- 통합 댓글 테이블 테스트 데이터
INSERT INTO `comment` (`post_id`, `content`, `user_id`, `user_name`, `visibility_level`, `confirm`, `is_deleted`, `create_date`, `modified_date`)
SELECT `id`, '상담요청97에 대한 첫 번째 답변입니다.', 'admin', '관리자', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청97'
UNION ALL SELECT `id`, '상담 내용을 확인했습니다. 추가 정보가 있으면 남겨주세요.', 'sdhan', '한상대', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청97'
UNION ALL SELECT `id`, '연락 가능한 시간대를 알려주시면 상담 일정을 맞추겠습니다.', 'admin', '관리자', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청97'
UNION ALL SELECT `id`, '자료를 검토한 뒤 다시 안내드리겠습니다.', 'judahwon', '주다훤', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청97'
UNION ALL SELECT `id`, '상담요청98에 대한 첫 번째 답변입니다.', 'admin', '관리자', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청98'
UNION ALL SELECT `id`, '현재 상황을 조금 더 구체적으로 남겨주세요.', 'sdhan', '한상대', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청98'
UNION ALL SELECT `id`, '비공개 상담으로 처리하겠습니다.', 'admin', '관리자', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청98'
UNION ALL SELECT `id`, '상담요청99에 대한 첫 번째 답변입니다.', 'admin', '관리자', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청99'
UNION ALL SELECT `id`, '남겨주신 내용을 기준으로 확인 중입니다.', 'jisu', '지수', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청99'
UNION ALL SELECT `id`, '필요하면 추가 연락처로 연락드리겠습니다.', 'admin', '관리자', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청99'
UNION ALL SELECT `id`, '다음 상담 가능 일정을 확인해 주세요.', 'sdhan', '한상대', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청99'
UNION ALL SELECT `id`, '관련 자료가 있으면 첨부 기능 구현 후 함께 올려주세요.', 'admin', '관리자', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청99'
UNION ALL SELECT `id`, '상담요청100에 대한 첫 번째 답변입니다.', 'admin', '관리자', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청100'
UNION ALL SELECT `id`, '상담 내용을 관리자에게 공유했습니다.', 'judahwon', '주다훤', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청100'
UNION ALL SELECT `id`, '안내가 필요한 부분을 정리해서 답변드리겠습니다.', 'admin', '관리자', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청100'
UNION ALL SELECT `id`, '상담요청101에 대한 첫 번째 답변입니다.', 'admin', '관리자', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청101'
UNION ALL SELECT `id`, '작성자 확인 후 상담 절차를 진행하겠습니다.', 'sdhan', '한상대', 'partial', 'confirmed', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청101'
UNION ALL SELECT `id`, '추가 질문은 댓글로 남겨주세요.', 'admin', '관리자', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청101'
UNION ALL SELECT `id`, '필요 시 전화 상담으로 전환하겠습니다.', 'jisu', '지수', 'partial', 'pending', 0, now(), now() FROM `post` WHERE `main_menu` = 'board' AND `sub_menu` = 'counseling' AND `title` = '상담요청101';

UPDATE `post` p
SET `comment_count` = (
    SELECT COUNT(*)
    FROM `comment` c
    WHERE c.`post_id` = p.`id`
)
WHERE p.`main_menu` = 'board'
  AND p.`sub_menu` = 'counseling'
  AND p.`title` IN ('상담요청97', '상담요청98', '상담요청99', '상담요청100', '상담요청101');
