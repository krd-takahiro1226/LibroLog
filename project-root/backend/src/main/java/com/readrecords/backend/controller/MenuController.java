package com.readrecords.backend.controller;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.service.ReadRecordsService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// 初期メニューから各種機能へ遷移させるためのController
@RestController
public class MenuController {
  private static final Logger logger = LoggerFactory.getLogger(MenuController.class);
  @Autowired ReadRecordsService readRecordsService;

  @GetMapping("/showRecords")
  public ResponseEntity<?> showUserReadRecords(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      logger.warn("Unauthorized access attempt");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
    }

    try {
      logger.info("Authenticated user: {}", authentication.getName());
      System.out.println("Authentication: " + authentication);
      String userId = authentication.getDetails().toString();
      logger.info("Fetching records for userId: {}", userId);

      List<UserReadRecordsDto> userReadRecords = readRecordsService.getReadRecordsByUserId(userId);
      return ResponseEntity.ok(userReadRecords);

    } catch (Exception e) {
      logger.error("Error fetching records", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching records");
    }
  }

  @GetMapping("/searchBooks")
  public ResponseEntity<String> showSearchWindow() {
    return ResponseEntity.ok("searchBooks endpoint");
  }
}
