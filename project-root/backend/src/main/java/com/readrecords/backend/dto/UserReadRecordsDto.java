package com.readrecords.backend.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class UserReadRecordsDto {
    private String ISBN;
    private String book_name;
    private String author;
    private Date start_date;
    private Date end_date;
    private Integer read_count;
    private Integer priority;
    private String memo;

    public UserReadRecordsDto(String ISBN, String book_name, String author, Date start_date, Date end_date,
            Integer read_count, Integer priority, String memo) {
        this.ISBN = ISBN;
        this.book_name = book_name;
        this.author = author;
        this.start_date = start_date;
        this.end_date = end_date;
        this.read_count = read_count;
        this.priority = priority;
        this.memo = memo;
    }
}
