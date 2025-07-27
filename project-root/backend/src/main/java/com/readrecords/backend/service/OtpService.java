package com.readrecords.backend.service;

import com.readrecords.backend.entity.TemporaryUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import com.readrecords.backend.dto.OtpVerificationResult;
import com.readrecords.backend.dto.OtpResendResult;

/**
 * OTP（ワンタイムパスワード）管理サービス
 */
@Service
public class OtpService {

  private static final Logger logger = LoggerFactory
      .getLogger(OtpService.class);

  // メモリ上で一時ユーザー情報を管理
  private final ConcurrentHashMap<String, TemporaryUser> temporaryUsers = new ConcurrentHashMap<>();

  @Value("${otp.length:6}")
  private int otpLength;

  @Value("${otp.expire.minutes:10}")
  private int otpExpireMinutes;

  @Value("${otp.max.attempts:3}")
  private int maxAttempts;

  @Value("${otp.resend.wait.seconds:60}")
  private int resendWaitSeconds;

  private final SecureRandom secureRandom = new SecureRandom();

  /**
   * OTPを生成して一時ユーザー情報と共に保存
   */
  public String generateAndStoreOtp(String email, String username,
      String hashedPassword) {
    String otp = generateOtp();
    LocalDateTime expireTime = LocalDateTime.now()
        .plusMinutes(otpExpireMinutes);

    TemporaryUser tempUser = new TemporaryUser(email, username, hashedPassword,
        otp, expireTime);
    temporaryUsers.put(email, tempUser);

    logger.info("OTP generated for email: {}", email);
    return otp;
  }

  /**
   * OTPを検証
   */
  public OtpVerificationResult verifyOtp(String email, String inputOtp) {
    TemporaryUser tempUser = temporaryUsers.get(email);

    if (tempUser == null) {
      logger.warn("Temporary user not found for email: {}", email);
      return OtpVerificationResult.USER_NOT_FOUND;
    }

    // 有効期限チェック
    if (LocalDateTime.now().isAfter(tempUser.getOtpExpireTime())) {
      logger.warn("OTP expired for email: {}", email);
      temporaryUsers.remove(email);
      return OtpVerificationResult.EXPIRED;
    }

    // 試行回数チェック
    if (tempUser.getFailedAttempts() >= maxAttempts) {
      logger.warn("Max attempts exceeded for email: {}", email);
      temporaryUsers.remove(email);
      return OtpVerificationResult.MAX_ATTEMPTS_EXCEEDED;
    }

    // OTP検証
    if (!tempUser.getOtp().equals(inputOtp)) {
      tempUser.setFailedAttempts(tempUser.getFailedAttempts() + 1);
      logger.warn("Invalid OTP for email: {}, attempts: {}", email,
          tempUser.getFailedAttempts());
      return OtpVerificationResult.INVALID;
    }

    logger.info("OTP verification successful for email: {}", email);
    return OtpVerificationResult.SUCCESS;
  }

  /**
   * 認証成功後に一時ユーザー情報を取得して削除
   */
  public TemporaryUser getAndRemoveTemporaryUser(String email) {
    return temporaryUsers.remove(email);
  }

  /**
   * OTPを再送（再生成）
   */
  public OtpResendResult resendOtp(String email) {
    TemporaryUser tempUser = temporaryUsers.get(email);

    if (tempUser == null) {
      logger.warn("Temporary user not found for resend: {}", email);
      return new OtpResendResult(false, "ユーザー情報が見つかりません", null);
    }

    // 再送待機時間チェック
    if (tempUser.getLastResendTime() != null) {
      LocalDateTime nextAllowedResend = tempUser.getLastResendTime()
          .plusSeconds(resendWaitSeconds);
      if (LocalDateTime.now().isBefore(nextAllowedResend)) {
        long waitSeconds = java.time.Duration
            .between(LocalDateTime.now(), nextAllowedResend).getSeconds();
            
        return new OtpResendResult(false, "再送は" + waitSeconds + "秒後に可能です", null);
      }
    }

    // 新しいOTPを生成
    String newOtp = generateOtp();
    LocalDateTime newExpireTime = LocalDateTime.now()
        .plusMinutes(otpExpireMinutes);

    tempUser.setOtp(newOtp);
    tempUser.setOtpExpireTime(newExpireTime);
    tempUser.setFailedAttempts(0); // 失敗回数をリセット
    tempUser.setLastResendTime(LocalDateTime.now());

    logger.info("OTP resent for email: {}", email);
    return new OtpResendResult(true, "認証コードを再送しました", newOtp);
  }

  /**
   * 有効期限を文字列形式で取得
   */
  public String getFormattedExpireTime(String email) {
    TemporaryUser tempUser = temporaryUsers.get(email);
    if (tempUser == null) {
      return "";
    }

    DateTimeFormatter formatter = DateTimeFormatter
        .ofPattern("yyyy年MM月dd日 HH:mm");
    return tempUser.getOtpExpireTime().format(formatter);
  }

  /**
   * 6桁の数字OTPを生成
   */
  private String generateOtp() {
    StringBuilder otp = new StringBuilder();
    for (int i = 0; i < otpLength; i++) {
      otp.append(secureRandom.nextInt(10));
    }
    return otp.toString();
  }

  /**
   * 期限切れの一時ユーザー情報をクリーンアップ
   */
  public void cleanupExpiredUsers() {
    LocalDateTime now = LocalDateTime.now();
    temporaryUsers.entrySet()
        .removeIf(entry -> now.isAfter(entry.getValue().getOtpExpireTime()));
  }
}
