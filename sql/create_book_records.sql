CREATE TABLE IF NOT EXISTS book_records (
    ISBN VARCHAR(13) PRIMARY KEY,
    book_name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(20),
    publication_year DATE,
    publisher VARCHAR(100)
);
