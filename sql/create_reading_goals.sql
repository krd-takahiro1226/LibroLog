CREATE TABLE reading_goals (
    goal_id            INT AUTO_INCREMENT PRIMARY KEY,  -- 目標管理テーブルID(PK)
    goal_read_number   INT             NOT NULL,        -- 目標冊数
    user_id            varchar(255)    NOT NULL,        -- ユーザID(FK想定)
    count_start_date   DATE            NOT NULL,        -- カウント開始日
    count_end_date     DATE            NOT NULL,        -- カウント終了日
    is_year_goal       BOOLEAN         NOT NULL,        -- 年間目標かどうか

    -- 外部キー制約（例: userテーブルのuser_idを参照）
    CONSTRAINT fk_reading_goals_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);
