package com.readrecords.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.readrecords.backend.service.ReadingGoalsService;

@RestController
public class ReadingGoalsController {

  @Autowired
  ReadingGoalsService readingGoalsService;

  @PostMapping("/setReadingGoals")
  public ResponseEntity<?> registerReadingGoals(int monthlyGoalReadNumber,
      int yearlyGoalReadNumber, Authentication authentication,
      boolean isMonthlySet, boolean isYearlySet) {
    System.out.println("Monthly goal: " + monthlyGoalReadNumber);
    System.out.println("Yearly goal: " + yearlyGoalReadNumber);
    System.out.println("isMonthlySet: " + isMonthlySet);
    System.out.println("isYearlySet: " + isYearlySet);
    if (!isMonthlySet) {
      // 月間目標の登録
      readingGoalsService.registerReadingMonthlyGoals(monthlyGoalReadNumber,
          authentication);
    }
    if (!isYearlySet) {
      // 年間目標の登録
      readingGoalsService.registerReadingYearlyGoals(yearlyGoalReadNumber,
          authentication);
    }
    return ResponseEntity.ok("Reading goals set successfully");
  }
}
