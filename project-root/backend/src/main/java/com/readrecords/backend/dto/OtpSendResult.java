package com.readrecords.backend.dto;

/**
 * OTP送信結果のデータクラス
 */
public class OtpSendResult {
  private final boolean success;
  private final String message;

  public OtpSendResult(boolean success, String message) {
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
