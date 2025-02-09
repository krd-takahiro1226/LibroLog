package com.readrecords.backend.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.service.EmailChangeService;

@RestController
@RequestMapping("/useremail")
public class EmailChangeController {
  @Autowired
  EmailChangeService emailChangeService;

  private static final Logger logger = LoggerFactory.getLogger(EmailChangeController.class);

  @PutMapping("/changeemail")
  public ResponseEntity<?> changeEmail(
      Authentication authentication,
      @RequestBody Map<String, String> requestData) {

    String userId = getUserId(authentication);
    String newUserEmail = requestData.get("newUserEmail");
    logger.info("userID: " + userId + " のメールアドレスを " + newUserEmail + " に変更します。");

    try {
      emailChangeService.changeEmail(userId, newUserEmail);
      return ResponseEntity.status(HttpStatus.OK).body("Email updated successfully");
    } catch (Exception e) {
      logger.error("メールアドレス変更中にエラーが発生しました:", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("エラーが発生しました。後ほどお試しください。");
    }
  }

  private String getUserId (Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      logger.warn("Unauthorized access attempt");
      throw new IllegalStateException("Authentication is required to fetch userId");
    }

    try {
      logger.info("Authenticated user: {}", authentication.getName());
      System.out.println("Authentication: " + authentication);
      String userId = authentication.getDetails().toString();
      logger.info("Fetching records for userId: {}", userId);
      return userId;
    } 
    catch (Exception e) {
      logger.error("Error fetching records", e);
      throw new IllegalStateException("Failed to fetch userId", e);
    }
  }
}
