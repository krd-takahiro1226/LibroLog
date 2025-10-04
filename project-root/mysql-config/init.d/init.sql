CREATE TABLE IF NOT EXISTS book_records (
    ISBN VARCHAR(13) PRIMARY KEY,
    book_name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(20),
    publication_year DATE,
    publisher VARCHAR(100),
    image_url VARCHAR(500)
);
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
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE reading_goals (
    goal_id            INT AUTO_INCREMENT PRIMARY KEY,  -- PK
    goal_read_number   INT             NOT NULL,        -- 目標冊数
    user_id            varchar(255)    NOT NULL,        -- ユーザID(FK想定)
    count_start_date   DATE            NOT NULL,        -- カウント開始日
    count_end_date     DATE            NOT NULL,        -- カウント終了日
    is_year_goal       BOOLEAN         NOT NULL,        -- 年間目標かどうか

    -- 外部キー制約（例: userテーブルのuser_idを参照）
    CONSTRAINT fk_reading_goals_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- 読書実績管理テーブル (例: reading_records)
CREATE TABLE reading_records (
    record_id      INT AUTO_INCREMENT PRIMARY KEY,  -- 個別の実績ID(PK)を追加
    goal_id        INT             NOT NULL,        -- 目標管理テーブルのID(FK)
    ISBN           VARCHAR(13)     NOT NULL,        -- ISBN(FK想定)
    user_id        varchar(255)      NOT NULL,      -- ユーザID(FK想定)
    read_start_date DATE,                           -- 読み始めた日
    read_end_date   DATE,                           -- 読了予定日
    read_done_date  DATE,                           -- 実際の読了日
    is_read_done    BOOLEAN,                        -- 読了済フラグ

    -- 外部キー制約（例）
    CONSTRAINT fk_reading_records_goals
        FOREIGN KEY (goal_id) REFERENCES reading_goals(goal_id),
    CONSTRAINT fk_reading_records_users
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reading_records_books
        FOREIGN KEY (ISBN) REFERENCES book_records(ISBN)
);

CREATE TABLE IF NOT EXISTS favorite_authors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_author (user_id, author_name)
);