package com.readrecords.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * OTP認証待ちの一時ユーザー情報（Redis用）
 */
@Data
@NoArgsConstructor
public class TemporaryUser implements Serializable {

  private static final long serialVersionUID = 1L;

  /** メールアドレス（キー） */
  private String email;

  /** ユーザー名 */
  private String username;

  /** パスワード（ハッシュ化済み） */
  private String password;

  /** ワンタイムパスワード */
  private String otp;

  /** OTP失敗回数 */
  private int failedAttempts = 0;

  /** OTP有効期限 */
  private LocalDateTime otpExpireTime;

  /** 作成日時 */
  private LocalDateTime createdAt;

  /** 最後の再送日時 */
  private LocalDateTime lastResendTime;

  @JsonCreator
  public TemporaryUser(
      @JsonProperty("email") String email,
      @JsonProperty("username") String username,
      @JsonProperty("password") String password,
      @JsonProperty("otp") String otp,
      @JsonProperty("otpExpireTime") LocalDateTime otpExpireTime) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.otp = otp;
    this.failedAttempts = 0;
    this.otpExpireTime = otpExpireTime;
    this.createdAt = LocalDateTime.now();
  }
}
