package com.readrecords.backend.service;

import com.readrecords.backend.dto.ReadingAchievementsDto;

public interface ReadingAchievementsService {
  /**
   * ユーザの読書目標・実績情報を取得する
   * @param user_id
   * @return 読書目標・実績情報DTO
   */
  public ReadingAchievementsDto getReadAchievementsByUserId(String user_id);
}
