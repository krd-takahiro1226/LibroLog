package com.readrecords.backend.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

/** 読書実績情報 */
@Data
@Entity
@Table(name = "reading_records")
public class ReadingRecords {
  /** 管理ID(PK) */
  @Id private String goalId;
  /** ISBN */
  private String ISBN;
  /** ユーザーID */
  private String user_id;
  /** 読み始めた日 */
  private Date read_start_date;
  /** 読了予定日 */
  private Date read_end_date;
  /** 読み終わった日 */
  private Date read_done_date;
  /** 読了フラグ */
  private boolean is_read_done;
}
