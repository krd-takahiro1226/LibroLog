package com.readrecords.backend.dto;

/**
 * ユーザー登録結果のデータクラス
 */
public class UserRegistrationResult {
  private final boolean success;
  private final String message;

  public UserRegistrationResult(boolean success, String message) {
    this.success = success;
    this.message = message;
  }

  public boolean isSuccess() {
    return success;
  }

  public String getMessage() {
    return message;
  }
}
