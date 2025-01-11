package com.readrecords.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.service.UserPasswordChangeService;

@RestController
@RequestMapping("/userPassword")
public class UserPasswordChangeController {
    @Autowired private UserPasswordChangeService userPassChangeService;
  
    @PutMapping("/change")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordDetails) {
      String userId = passwordDetails.get("userId");
      String oldPassword = passwordDetails.get("oldPassword");
      String newPassword = passwordDetails.get("newPassword");
      String confirmPassword = passwordDetails.get("confirmPassword");
  
      try {
        userPassChangeService.changePassword(userId, oldPassword, newPassword, confirmPassword);
        return ResponseEntity.status(HttpStatus.OK).body("Password updated successfully");
      } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
      }
    }
  }
