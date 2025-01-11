package com.readrecords.backend.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

/** 読書目標情報 */
@Data
@Entity
@Table(name = "reading_goals")
public class ReadingGoals {
  /** 目標管理ID(PK) */
  @Id private Integer goalId;
  /** 目標読書数 */
  private Integer goalReadNumber;
  /** ユーザID */
  private String userId;
  /** 目標期間開始日 */
  private Date countStartDate;
  /** 目標期間終了日 */
  private Date countEndDate;
  /** 年間目標であるかどうか */
  private boolean isYearGoal;
}
