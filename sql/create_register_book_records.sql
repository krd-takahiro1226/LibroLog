CREATE TABLE IF NOT EXISTS register_book_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(13),
    user_id VARCHAR(36),
    start_date DATE,
    end_date DATE,
    read_count INT,
    priority INT,
    memo VARCHAR(100)
);
