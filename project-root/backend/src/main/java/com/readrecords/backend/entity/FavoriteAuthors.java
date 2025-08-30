package com.readrecords.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.sql.Timestamp;
import lombok.Data;

/** お気に入り著者情報 */
@Data
@Entity
@Table(name = "favorite_authors")
public class FavoriteAuthors implements Serializable {
  private static final long serialVersionUID = 1L;
  
  /** お気に入り著者管理ID(PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  /** ユーザーID */
  private String userId;
  
  /** 著者名 */
  private String authorName;
  
  /** アクティブフラグ */
  private Boolean isActive;
  
  /** 作成日時 */
  private Timestamp createdAt;
}