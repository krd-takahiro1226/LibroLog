package com.readrecords.backend.controller;

import com.readrecords.backend.dto.ReadingAchievementsDto;
import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.service.ReadingAchievementsService;
import com.readrecords.backend.service.RegisterBookRecordsService;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// 初期メニューから各種機能へ遷移させるためのController
@RestController
public class MenuController {
  private static final Logger logger = LoggerFactory
      .getLogger(MenuController.class);
  @Autowired
  RegisterBookRecordsService readRecordsService;

  @Autowired
  ReadingAchievementsService readingAchievementsService;

  @GetMapping("/showRecords")
  public ResponseEntity<?> showUserReadRecords(
    Authentication authentication,
    @RequestParam(defaultValue = "1") int page,  // ページ番号（デフォルト: 1）
    @RequestParam(defaultValue = "10") int limit // 1ページの件数（デフォルト: 10）
    ) {
    String userId = getUserId(authentication);
    try {
      Page<UserReadRecordsDto> userReadRecords = readRecordsService.getReadRecordsByUserId(userId, page, limit);
      Map<String, Object> response = new HashMap<>();
      response.put("books", userReadRecords.getContent()); // 書籍リスト
      response.put("totalPages", userReadRecords.getTotalPages()); // 全ページ数
      response.put("currentPage", userReadRecords.getNumber() + 1); // 現在のページ（1ベース）
      response.put("totalItems", userReadRecords.getTotalElements()); // 総件数

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      logger.error("Error fetching records", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching records");
    }
  }

  @GetMapping("/searchBooks")
  public ResponseEntity<String> showSearchWindow() {
    return ResponseEntity.ok("searchBooks endpoint");
  }

  @GetMapping("/showAchievements")
  public ResponseEntity<?> showReadingAchievementsWindow(
      Authentication authentication) {
    String userId = getUserId(authentication);
    try {
      ReadingAchievementsDto userReadingAchievements = readingAchievementsService
          .getReadAchievementsByUserId(userId);
      logger.info("実績情報: {}", userReadingAchievements);
      return ResponseEntity.ok(userReadingAchievements);

    } catch (Exception e) {
      logger.error("Error fetching records", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching records");
    }
  }

  private String getUserId(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      logger.warn("Unauthorized access attempt");
      throw new IllegalStateException(
          "Authentication is required to fetch userId");
    }

    try {
      logger.info("Authenticated user: {}", authentication.getName());
      System.out.println("Authentication: " + authentication);
      String userId = authentication.getDetails().toString();
      logger.info("Fetching records for userId: {}", userId);
      return userId;

    } catch (Exception e) {
      logger.error("Error fetching records", e);
      throw new IllegalStateException("Failed to fetch userId", e);
    }
  }
}
