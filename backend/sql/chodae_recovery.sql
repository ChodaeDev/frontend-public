DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `user` (
    `no` int(11) NOT NULL AUTO_INCREMENT,
    `ad_id` varchar(255) DEFAULT NULL,
    `ad_pass` varchar(255) DEFAULT NULL,
    `ad_mail` varchar(255) DEFAULT NULL,
    `ad_home` varchar(255) DEFAULT NULL,
    `ad_name` varchar(255) DEFAULT NULL,
    `ad_filesize` int(11) NOT NULL DEFAULT '0',
    `ad_imgsize` int(11) NOT NULL DEFAULT '0',
    `ad_memo` text,
    `ad_memo_css` varchar(255) DEFAULT NULL,
    `ad_tel` varchar(255) DEFAULT NULL,
    `ad_mail_top` text,
    `ad_mail_btm` text,
    `ad_limit_wr` text,
    `copyok` tinyint(4) NOT NULL DEFAULT '1',
    `msgok` tinyint(4) NOT NULL DEFAULT '1',
    `fmailok` tinyint(4) NOT NULL DEFAULT '1',
    `smsok` tinyint(4) NOT NULL DEFAULT '1',
    `login_time` text,
    `it_temp_a` varchar(255) DEFAULT NULL,
    `it_temp_b` varchar(255) DEFAULT NULL,
    `it_temp_c` varchar(255) DEFAULT NULL,
    `it_temp_d` varchar(255) DEFAULT NULL,
    `it_temp_e` int(11) NOT NULL DEFAULT '0',
    `it_temp_f` int(11) NOT NULL DEFAULT '0',
    `admin_gold` int(11) NOT NULL DEFAULT '60000',
    `admin_silver` int(11) NOT NULL DEFAULT '50000',
    `admin_bronze` int(11) NOT NULL DEFAULT '20000',
    PRIMARY KEY (`no`)
) ENGINE = MyISAM AUTO_INCREMENT = 4 DEFAULT CHARSET = euckr;
/*!40101 SET character_set_client = @saved_cs_client */
;

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