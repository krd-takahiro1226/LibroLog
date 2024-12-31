-- 読書実績管理テーブル (例: reading_records)
CREATE TABLE reading_records (
    record_id      INT AUTO_INCREMENT PRIMARY KEY,  -- 個別の実績ID(PK)を追加
    goal_id        INT             NOT NULL,        -- 目標管理テーブルのID(FK)
    ISBN           VARCHAR(13)     NOT NULL,        -- ISBN(FK想定)
    user_id        varchar(255)      NOT NULL,        -- ユーザID(FK想定)
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
