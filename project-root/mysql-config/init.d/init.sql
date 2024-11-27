CREATE TABLE IF NOT EXISTS book_records (
    ISBN VARCHAR(13) PRIMARY KEY,
    book_name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(20),
    publication_year DATE,
    publisher VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS read_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(13),
    user_id VARCHAR(36),
    start_date DATE,
    end_date DATE,
    read_count INT,
    priority INT,
    memo VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
