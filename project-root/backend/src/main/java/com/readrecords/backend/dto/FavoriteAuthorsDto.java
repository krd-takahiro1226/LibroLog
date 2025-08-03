package com.readrecords.backend.dto;

import lombok.Data;

/** お気に入り著者情報DTO */
@Data
public class FavoriteAuthorsDto {
  /** お気に入り著者管理ID */
  private Long id;
  
  /** 著者名 */
  private String authorName;
  
  /** フォロー中フラグ */
  private Boolean isFollowing;
}