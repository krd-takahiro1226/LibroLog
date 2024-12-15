package com.readrecords.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "book_records")
public class BookRecords {
    @Id
    private String ISBN;
    private String book_name;
    private String author;
    private String genre;
    private String publication_year;
    private String publisher;

}
