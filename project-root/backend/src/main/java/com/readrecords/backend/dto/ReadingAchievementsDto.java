package com.readrecords.backend.dto;

import lombok.Data;

/** 読書目標・実績情報DTO */
@Data
public class ReadingAchievementsDto {
  /** 読書冊数 */
  private int yearlyTotalBooks;
  /** 年間目標冊数 */
  private int yearlyGoal;
  /** 年間目標達成率 */
  private double yearlyPercentage;
  /** 月間読書冊数 */
  private int monthlyRead;
  /** 月間目標冊数 */
  private int monthlyGoal;
}
