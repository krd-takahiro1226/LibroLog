package com.readrecords.backend.dto;

/**
 * OTP再送結果のデータクラス
 */
public class OtpResendResult {
  private final boolean success;
  private final String message;
  private final String newOtp;

  public OtpResendResult(boolean success, String message, String newOtp) {
    this.success = success;
    this.message = message;
    this.newOtp = newOtp;
  }

  public OtpResendResult(boolean success, String message) {
    this.success = success;
    this.message = message;
    this.newOtp = null;
  }

  public boolean isSuccess() {
    return success;
  }

  public String getMessage() {
    return message;
  }

  public String getNewOtp() {
    return newOtp;
  }
}
