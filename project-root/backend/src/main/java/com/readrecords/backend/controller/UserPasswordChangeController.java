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

import com.readrecords.backend.service.UserPasswordChangeService;

@RestController
@RequestMapping("/userPassword")
public class UserPasswordChangeController {
  @Autowired private UserPasswordChangeService userPasswordChangeService;

  private static final Logger logger = LoggerFactory.getLogger(UserPasswordChangeController.class);

  @PutMapping("/change")
  public ResponseEntity<?> changePassword(
      Authentication authentication, 
      @RequestBody Map<String, String> passwordDetails) {
    
    String userId = getUserId(authentication);
    String oldPassword = passwordDetails.get("oldPassword");
    String newPassword = passwordDetails.get("newPassword");
    // String confirmPassword = passwordDetails.get("confirmPassword");

    try {
      userPasswordChangeService.changePassword(userId, oldPassword, newPassword);
      return ResponseEntity.status(HttpStatus.OK).body("Password updated successfully");
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
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
