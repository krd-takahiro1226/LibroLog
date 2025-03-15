package com.readrecords.backend.service;

import java.time.LocalDate;
import java.time.YearMonth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.ReadingGoalsRepository;

@Service
public class ReadingGoalsService {
  private static final Logger logger = LoggerFactory
      .getLogger(ReadingGoalsService.class);

  @Autowired
  ReadingGoalsRepository readingGoalsRepository;

  public void registerReadingMonthlyGoals(int goalReadNumber,
      Authentication authentication) {
    String userId = getUserId(authentication);
    // TODO 目標開始日は1日で良いか確認
    String countStartDate = LocalDate.now().withDayOfMonth(1).toString();
    String countEndDate = YearMonth.from(LocalDate.now()).atEndOfMonth()
        .toString();
    readingGoalsRepository.insertReadingMonthlyGoals(goalReadNumber, userId,
        countStartDate, countEndDate);
  }

  public void registerReadingYearlyGoals(int goalReadNumber,
      Authentication authentication) {
    String countStartDate = LocalDate.now().withDayOfMonth(1).toString();
    String countEndDate = YearMonth.from(LocalDate.now().withDayOfMonth(1))
        .plusYears(1).atEndOfMonth().toString();
    String userId = getUserId(authentication);
    readingGoalsRepository.insertReadingYearlyGoals(goalReadNumber, userId,
        countStartDate, countEndDate);
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
