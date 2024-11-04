package com.readrecords.backend.form;

import java.sql.Date;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookRecordsForm {
  @NotNull
  @Size(max = 13)
  private String ISBN;
  @NotNull
  private String book_name;
  @NotNull
  private String author;
  private String genre;
  private Date publication_year;
  private String publisher;
}
