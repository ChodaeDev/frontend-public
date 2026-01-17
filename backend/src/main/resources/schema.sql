-- MariaDB 데이터베이스 스키마 초기화 스크립트

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
    descr TEXT
);