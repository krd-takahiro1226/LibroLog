package com.readrecords.backend.service;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.OtpResendResult;
import com.readrecords.backend.dto.OtpSendResult;
import com.readrecords.backend.dto.UserRegistrationResult;
import com.readrecords.backend.entity.TemporaryUser;
import com.readrecords.backend.repository.UserLoginRepository;
import com.readrecords.backend.repository.UserRegistrationRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserRegistrationService {

  private static final Logger logger = LoggerFactory
      .getLogger(UserRegistrationService.class);

  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired
  UserRegistrationRepository userRegistrationRepository;
  @Autowired
  UserLoginRepository userLoginRepository;
  @Autowired
  OtpService otpService;
  @Autowired
  MailService mailService;

  /**
   * OTP送信処理（ユーザー登録第1段階）
   */
  public OtpSendResult sendOtpForRegistration(String username, String email,
      String password, String confirmPassword) {
    try {
      // パスワード確認チェック
      if (!checkPassword(password, confirmPassword)) {
        return new OtpSendResult(false, "パスワードが一致しません");
      }

      // メールアドレス重複チェック
      if (isEmailExists(email)) {
        return new OtpSendResult(false, "このメールアドレスは既に登録されています");
      }

      // パスワードをハッシュ化して一時保存
      String hashPassword = passwordEncoder.encode(password);
      String otp = otpService.generateAndStoreOtp(email, username,
          hashPassword);

      // OTPメール送信
      String expireTime = otpService.getFormattedExpireTime(email);
      mailService.sendOtpMail(email, otp, expireTime);

      logger.info("OTP sent for user registration: {}", email);
      return new OtpSendResult(true, "認証コードをメールアドレスに送信しました");

    } catch (Exception e) {
      logger.error("Error sending OTP for registration", e);
      return new OtpSendResult(false, "認証コードの送信に失敗しました");
    }
  }

  /**
   * OTP検証およびユーザー登録完了処理（ユーザー登録第2段階）
   */
  public UserRegistrationResult verifyOtpAndRegisterUser(String email,
      String otp) {
    try {
      com.readrecords.backend.dto.OtpVerificationResult result = otpService
          .verifyOtp(email,
              otp);

      switch (result) {
        case SUCCESS:
          // 一時ユーザー情報を取得してユーザー登録
          TemporaryUser tempUser = otpService.getAndRemoveTemporaryUser(email);
          if (tempUser != null) {
            String userId = UUID.randomUUID().toString();
            userRegistrationRepository.insertUserRecords(userId,
                tempUser.getUsername(),
                tempUser.getEmail(), tempUser.getPassword());
            logger.info("User registration completed: {}", email);
            return new UserRegistrationResult(true, "ユーザー登録が完了しました");
          } else {
            logger.error(
                "Temporary user not found after successful OTP verification: {}",
                email);
            return new UserRegistrationResult(false, "ユーザー情報の取得に失敗しました");
          }

        case INVALID:
          return new UserRegistrationResult(false, "ワンタイムパスワードが正しくありません");

        case EXPIRED:
          return new UserRegistrationResult(false, "ワンタイムパスワードの有効期限が切れています");

        case MAX_ATTEMPTS_EXCEEDED:
          return new UserRegistrationResult(false,
              "試行回数の上限に達しました。最初からやり直してください");

        case USER_NOT_FOUND:
          return new UserRegistrationResult(false,
              "認証情報が見つかりません。最初からやり直してください");

        default:
          return new UserRegistrationResult(false, "認証に失敗しました");
      }

    } catch (Exception e) {
      logger.error("Error verifying OTP for registration", e);
      return new UserRegistrationResult(false, "認証処理でエラーが発生しました");
    }
  }

  /**
   * OTP再送処理
   */
  public OtpResendResult resendOtp(String email) {
    try {
      OtpResendResult result = otpService.resendOtp(email);

      if (result.isSuccess()) {
        String expireTime = otpService.getFormattedExpireTime(email);
        mailService.sendOtpMail(email, result.getNewOtp(), expireTime);
        logger.info("OTP resent for: {}", email);
      }

      return new OtpResendResult(result.isSuccess(), result.getMessage());

    } catch (Exception e) {
      logger.error("Error resending OTP", e);
      return new OtpResendResult(false, "認証コードの再送に失敗しました");
    }
  }

  /**
   * 従来のユーザー登録処理（OTP無し、後方互換性のため残存）
   */
  public void userRegistration(String username, String email, String password,
      String confirmPassword) {
    String hashPassword = passwordEncoder.encode(password);
    String userId = UUID.randomUUID().toString();
    userRegistrationRepository.insertUserRecords(userId, username, email,
        hashPassword);
  }

  public boolean checkPassword(String password, String confirmPassword) {
    if (!password.equals(confirmPassword)) {
      // エラーハンドリングしたいが追いついていない
      // throw new IllegalArgumentException("パスワードが一致しません。");
      return false;
    }
    return true;
  }

  /**
   * メールアドレスの重複チェック
   */
  private boolean isEmailExists(String email) {
    try {
      return userLoginRepository.findByEmail(email).isPresent();
    } catch (Exception e) {
      logger.warn("Error checking email existence: {}", email, e);
      return false; // エラーの場合は重複なしとして処理続行
    }
  }

}
