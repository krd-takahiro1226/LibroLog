package com.readrecords.backend.service;

import com.readrecords.backend.dto.OtpResendResult;
import com.readrecords.backend.dto.OtpVerificationResult;
import com.readrecords.backend.entity.TemporaryUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * OTP（ワンタイムパスワード）管理サービス（Redis使用）
 */
@Service
public class OtpService {

  private static final Logger logger = LoggerFactory
      .getLogger(OtpService.class);

  @Autowired
  private RedisTemplate<String, TemporaryUser> temporaryUserRedisTemplate;

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
   * OTPを生成してRedisに保存（TTL付き）
   */
  public String generateAndStoreOtp(String email, String username,
      String hashedPassword) {
    String otp = generateOtp();
    LocalDateTime expireTime = LocalDateTime.now()
        .plusMinutes(otpExpireMinutes);

    TemporaryUser tempUser = new TemporaryUser(email, username, hashedPassword,
        otp, expireTime);

    // RedisにTTL付きで保存（有効期限で自動削除）
    String key = getRedisKey(email);
    temporaryUserRedisTemplate.opsForValue().set(key, tempUser,
        Duration.ofMinutes(otpExpireMinutes));

    logger.info("OTP generated and saved to Redis for email: {}", email);
    return otp;
  }

  /**
   * OTPを検証
   */
  public OtpVerificationResult verifyOtp(String email, String inputOtp) {
    String key = getRedisKey(email);
    TemporaryUser tempUser = temporaryUserRedisTemplate.opsForValue().get(key);

    if (tempUser == null) {
      logger.warn("Temporary user not found or expired for email: {}", email);
      return OtpVerificationResult.USER_NOT_FOUND;
    }

    // 有効期限チェック（念のため、通常はRedisのTTLで管理）
    if (LocalDateTime.now().isAfter(tempUser.getOtpExpireTime())) {
      logger.warn("OTP expired for email: {}", email);
      temporaryUserRedisTemplate.delete(key);
      return OtpVerificationResult.EXPIRED;
    }

    // 試行回数チェック
    if (tempUser.getFailedAttempts() >= maxAttempts) {
      logger.warn("Max attempts exceeded for email: {}", email);
      temporaryUserRedisTemplate.delete(key);
      return OtpVerificationResult.MAX_ATTEMPTS_EXCEEDED;
    }

    // OTP検証
    if (!tempUser.getOtp().equals(inputOtp)) {
      tempUser.setFailedAttempts(tempUser.getFailedAttempts() + 1);
      // 残り有効期限を計算して再保存
      Long remainingSeconds = temporaryUserRedisTemplate.getExpire(key);
      if (remainingSeconds != null && remainingSeconds > 0) {
        Duration remainingTtl = Duration.ofSeconds(remainingSeconds);
        temporaryUserRedisTemplate.opsForValue().set(key, tempUser,
            remainingTtl);
      }
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
    String key = getRedisKey(email);
    TemporaryUser tempUser = temporaryUserRedisTemplate.opsForValue().get(key);
    if (tempUser != null) {
      temporaryUserRedisTemplate.delete(key);
      logger.info("Temporary user retrieved and removed from Redis: {}", email);
      return tempUser;
    }
    logger.warn("Temporary user not found in Redis: {}", email);
    return null;
  }

  /**
   * OTPを再送（再生成）
   */
  public OtpResendResult resendOtp(String email) {
    String key = getRedisKey(email);
    TemporaryUser tempUser = temporaryUserRedisTemplate.opsForValue().get(key);

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
        return new OtpResendResult(false, "再送は" + waitSeconds + "秒後に可能です",
            null);
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

    // Redisに再保存（TTL更新）
    temporaryUserRedisTemplate.opsForValue().set(key, tempUser,
        Duration.ofMinutes(otpExpireMinutes));

    logger.info("OTP resent and saved to Redis for email: {}", email);
    return new OtpResendResult(true, "認証コードを再送しました", newOtp);
  }

  /**
   * 有効期限を文字列形式で取得
   */
  public String getFormattedExpireTime(String email) {
    String key = getRedisKey(email);
    TemporaryUser tempUser = temporaryUserRedisTemplate.opsForValue().get(key);
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
   * Redisキーを生成
   */
  private String getRedisKey(String email) {
    return "temporary_user:" + email;
  }
}
