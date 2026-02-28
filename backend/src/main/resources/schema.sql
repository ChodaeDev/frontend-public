-- MariaDB 데이터베이스 스키마 초기화 스크립트

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS private_counseling;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    phone VARCHAR(50),
    church VARCHAR(150),
    birthday DATE,
    descr TEXT,
    level VARCHAR(20) NOT NULL DEFAULT 'general' COMMENT 'superadmin, admin, general'
);

CREATE TABLE private_counseling (
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

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(100),
    author_name VARCHAR(100) NOT NULL,
    content TEXT,
    private_num INT NOT NULL,
    confirm VARCHAR(20),
    reg_dt DATETIME
);