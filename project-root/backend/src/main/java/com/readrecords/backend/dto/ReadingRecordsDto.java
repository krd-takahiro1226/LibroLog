package com.readrecords.backend.dto;

import lombok.Data;

/** 読書履歴情報DTO */
@Data
public class ReadingRecordsDto {
  /** ISBN */
  private String ISBN;

  /** 書籍名 */
  private String bookName;

  /** 著者名 */
  private String author;

}
