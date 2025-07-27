package com.readrecords.backend.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 一時ユーザー情報エンティティ（Redis保存用）
 */
public class TemporaryUser implements Serializable {

  private static final long serialVersionUID = 1L;

  private String email;
  private String username;
  private String password; // ハッシュ化済み
  private String otp;
  private LocalDateTime otpExpireTime;
  private int failedAttempts;
  private LocalDateTime lastResendTime;

  // デフォルトコンストラクタ
  public TemporaryUser() {
  }

  // パラメータ付きコンストラクタ
  public TemporaryUser(String email, String username, String password,
      String otp, LocalDateTime otpExpireTime) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.otp = otp;
    this.otpExpireTime = otpExpireTime;
    this.failedAttempts = 0;
    this.lastResendTime = null;
  }

  // Getter and Setter methods
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getOtp() {
    return otp;
  }

  public void setOtp(String otp) {
    this.otp = otp;
  }

  public LocalDateTime getOtpExpireTime() {
    return otpExpireTime;
  }

  public void setOtpExpireTime(LocalDateTime otpExpireTime) {
    this.otpExpireTime = otpExpireTime;
  }

  public int getFailedAttempts() {
    return failedAttempts;
  }

  public void setFailedAttempts(int failedAttempts) {
    this.failedAttempts = failedAttempts;
  }

  public LocalDateTime getLastResendTime() {
    return lastResendTime;
  }

  public void setLastResendTime(LocalDateTime lastResendTime) {
    this.lastResendTime = lastResendTime;
  }

  @Override
  public String toString() {
    return "TemporaryUser{" +
        "email='" + email + '\'' +
        ", username='" + username + '\'' +
        ", otp='" + otp + '\'' +
        ", otpExpireTime=" + otpExpireTime +
        ", failedAttempts=" + failedAttempts +
        ", lastResendTime=" + lastResendTime +
        '}';
  }
}
