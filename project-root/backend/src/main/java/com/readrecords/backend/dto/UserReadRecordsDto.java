package com.readrecords.backend.dto;

import java.sql.Date;
import lombok.Data;

@Data
public class UserReadRecordsDto {
  private String ISBN;
  private String bookName;
  private String author;
  private Date startDate;
  private Date endDate;
  private Integer readCount;
  private Integer priority;
  private String memo;
  private String imageUrl;

  public UserReadRecordsDto(
      String ISBN,
      String bookName,
      String author,
      Date startDate,
      Date endDate,
      Integer readCount,
      Integer priority,
      String memo,
      String imageUrl) {
    this.ISBN = ISBN;
    this.bookName = bookName;
    this.author = author;
    this.startDate = startDate;
    this.endDate = endDate;
    this.readCount = readCount;
    this.priority = priority;
    this.memo = memo;
    this.imageUrl = imageUrl;
  }
}
