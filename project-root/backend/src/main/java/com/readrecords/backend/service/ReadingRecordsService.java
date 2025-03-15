package com.readrecords.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.ReadingRecordsDto;
import com.readrecords.backend.entity.BookRecords;
import com.readrecords.backend.repository.BookRecordsRepository;
import com.readrecords.backend.repository.ReadingGoalsRepository;

@Service
public class ReadingRecordsService {
  private static final Logger logger = LoggerFactory
      .getLogger(ReadingRecordsService.class);

  private static final String MONTHLY_GOAL = "MonthlyGoal";

  private static final String YEARLY_GOAL = "YearlyGoal";

  private static final String BOOK_COUNT = "BookCount";

  private static final String TARGET_BOOKS = "TargetBooks";

  @Autowired
  BookRecordsRepository bookRecordsRepository;

  @Autowired
  ReadingGoalsRepository readingGoalsRepository;

  public Map<String, Object> getReadingRecords(
      Authentication authentication) {
    String userId = getUserId(authentication);
    String monthlyGoalId = readingGoalsRepository
        .getMonthlyGoalIdByUserIdAndCurrentDate(userId);
    String yearlyGoalId = readingGoalsRepository
        .getYearlyGoalIdByUserIdAndCurrentDate(userId);

    // 結果を格納するMap
    Map<String, Object> readingRecordsMap = new HashMap<>();
    Map<String, Object> monthlyBooksMap = new HashMap<>();
    Map<String, Object> yearlyBooksMap = new HashMap<>();

    // 月間・年間目標に紐づく書籍情報を取得
    List<ReadingRecordsDto> readingMonthlyRecords = getBookRecordsByGoalId(
        monthlyGoalId);
    List<ReadingRecordsDto> readingYearlyRecords = getBookRecordsByGoalId(
        yearlyGoalId);

    // 月間・年間の読書目標数を取得
    int monthlyGoalCount = readingGoalsRepository
        .getGoalReadNumberByGoalId(monthlyGoalId).orElse(0);
    int yearlyGoalCount = readingGoalsRepository
        .getGoalReadNumberByGoalId(yearlyGoalId).orElse(0);

    // Mapに格納
    monthlyBooksMap.put(BOOK_COUNT, monthlyGoalCount);
    monthlyBooksMap.put(TARGET_BOOKS, readingMonthlyRecords);
    readingRecordsMap.put(MONTHLY_GOAL, monthlyBooksMap);
    yearlyBooksMap.put(BOOK_COUNT, yearlyGoalCount);
    yearlyBooksMap.put(TARGET_BOOKS, readingYearlyRecords);
    readingRecordsMap.put(YEARLY_GOAL, yearlyBooksMap);
    System.out.println(readingRecordsMap);
    return readingRecordsMap;
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

  // 月間・年間目標に紐づく書籍情報を取得
  private List<ReadingRecordsDto> getBookRecordsByGoalId(String goalId) {
    List<BookRecords> bookRecordsList = bookRecordsRepository
        .getBookRecordsByISBNAndGoalId(goalId);
    List<ReadingRecordsDto> bookDtos = new ArrayList<>();

    for (BookRecords bookRecord : bookRecordsList) {
      ReadingRecordsDto dto = new ReadingRecordsDto();
      dto.setISBN(bookRecord.getISBN());
      dto.setBookName(bookRecord.getBookName());
      dto.setAuthor(bookRecord.getAuthor());
      bookDtos.add(dto);
    }
    return bookDtos;
  }
}
