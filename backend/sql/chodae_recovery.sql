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
    `descr` text,
    `upd_dt` varchar(50) DEFAULT NULL,
    `reg_dt` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
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