package com.readrecords.backend.dto;

/**
 * OTP検証結果の列挙型
 */
public enum OtpVerificationResult {
  SUCCESS,
  INVALID,
  EXPIRED,
  MAX_ATTEMPTS_EXCEEDED,
  USER_NOT_FOUND
}
