package com.readrecords.backend.controller;

import com.readrecords.backend.dto.OtpResendResult;
import com.readrecords.backend.dto.OtpSendResult;
import com.readrecords.backend.dto.UserRegistrationResult;
import com.readrecords.backend.service.UserRegistrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * OTP（ワンタイムパスワード）機能のコントローラー
 */
@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = { "http://localhost:3000",
    "http://localhost:8080" }, allowCredentials = "true")
public class OtpController {

  private static final Logger logger = LoggerFactory
      .getLogger(OtpController.class);

  @Autowired
  private UserRegistrationService userRegistrationService;

  /**
   * ユーザー登録用OTP送信
   */
  @PostMapping("/send-registration")
  public ResponseEntity<OtpSendResult> sendRegistrationOtp(
      @RequestBody Map<String, String> request) {
    try {
      String username = request.get("username");
      String email = request.get("email");
      String password = request.get("password");
      String confirmPassword = request.get("confirmPassword");

      logger.info("Registration OTP request for email: {}", email);

      OtpSendResult result = userRegistrationService.sendOtpForRegistration(
          username, email, password, confirmPassword);

      return ResponseEntity.ok(result);

    } catch (Exception e) {
      logger.error("Error sending registration OTP", e);
      return ResponseEntity.ok(new OtpSendResult(false, "サーバーエラーが発生しました"));
    }
  }

  /**
   * ユーザー登録用OTP検証およびユーザー登録完了
   */
  @PostMapping("/verify-registration")
  public ResponseEntity<UserRegistrationResult> verifyRegistrationOtp(
      @RequestBody Map<String, String> request) {
    try {
      String email = request.get("email");
      String otp = request.get("otp");

      logger.info("Registration OTP verification for email: {}", email);

      UserRegistrationResult result = userRegistrationService
          .verifyOtpAndRegisterUser(email, otp);

      return ResponseEntity.ok(result);

    } catch (Exception e) {
      logger.error("Error verifying registration OTP", e);
      return ResponseEntity
          .ok(new UserRegistrationResult(false, "サーバーエラーが発生しました"));
    }
  }

  /**
   * OTP再送
   */
  @PostMapping("/resend")
  public ResponseEntity<OtpResendResult> resendOtp(
      @RequestBody Map<String, String> request) {
    try {
      String email = request.get("email");

      logger.info("OTP resend request for email: {}", email);

      OtpResendResult result = userRegistrationService.resendOtp(email);

      return ResponseEntity.ok(result);

    } catch (Exception e) {
      logger.error("Error resending OTP", e);
      return ResponseEntity.ok(new OtpResendResult(false, "サーバーエラーが発生しました"));
    }
  }
}
