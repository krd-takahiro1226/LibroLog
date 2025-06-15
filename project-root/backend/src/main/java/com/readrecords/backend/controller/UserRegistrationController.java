package com.readrecords.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.service.UserRegistrationService;

@RestController
@RequestMapping("/userRegistration")
public class UserRegistrationController {
  @Autowired
  UserRegistrationService userRegistrationService;

  @PostMapping
  public ResponseEntity<?> registerUser(
      @RequestBody Map<String, String> userDetails) {
    String username = userDetails.get("username");
    String email = userDetails.get("email");
    String password = userDetails.get("password");
    String confirmPassword = userDetails.get("confirmPassword");

    boolean check = userRegistrationService.checkPassword(password,
        confirmPassword);
    if (!check) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Passwords do not match");
    }
    userRegistrationService.userRegistration(username, email, password,
        confirmPassword);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body("User registered successfully");
  }
}
