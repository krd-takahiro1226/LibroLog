package com.readrecords.backend.service;

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

  @Autowired
  BookRecordsRepository bookRecordsRepository;

  @Autowired
  ReadingGoalsRepository readingGoalsRepository;

  public Map<String, List<ReadingRecordsDto>> getReadingRecords(Authentication authentication) {
    String userId = getUserId(authentication);
    String monthlyGoalId = readingGoalsRepository.getMonthlyGoalIdByUserIdAndCurrentDate(userId);
    String yearlyGoalId = readingGoalsRepository.getYearlyGoalIdByUserIdAndCurrentDate(userId);

    // 返却用のMapを作成
    Map<String, List<ReadingRecordsDto>> readingRecordsDtoListMap = new HashMap<String, List<ReadingRecordsDto>>();
    List<ReadingRecordsDto> readingMonthlyRecordsDtoList = new java.util.ArrayList<ReadingRecordsDto>();
    List<ReadingRecordsDto> readingYearlyRecordsDtoList = new java.util.ArrayList<ReadingRecordsDto>();

    // 月間・年間目標に紐づく書籍情報を取得
    List<BookRecords> monthlyBookRecordsList = bookRecordsRepository.getBookRecordsByISBNAndGoalId(monthlyGoalId);
    List<BookRecords> yearlyBookRecordsList = bookRecordsRepository.getBookRecordsByISBNAndGoalId(yearlyGoalId);

    // 月間目標に紐づく書籍情報に関する処理
    for (BookRecords monthlyBookRecord : monthlyBookRecordsList) {
      ReadingRecordsDto readingMonthlyRecordsDto = new ReadingRecordsDto();
      readingMonthlyRecordsDto.setISBN(monthlyBookRecord.getISBN());
      readingMonthlyRecordsDto.setBookName(monthlyBookRecord.getBookName());
      readingMonthlyRecordsDto.setAuthor(monthlyBookRecord.getAuthor());
      readingMonthlyRecordsDtoList.add(readingMonthlyRecordsDto);
    }
    // 年間目標に紐づく書籍情報に関する処理
    for (BookRecords yearlyBookRecord : yearlyBookRecordsList) {
      ReadingRecordsDto readingYearlyRecordsDto = new ReadingRecordsDto();
      readingYearlyRecordsDto.setISBN(yearlyBookRecord.getISBN());
      readingYearlyRecordsDto.setBookName(yearlyBookRecord.getBookName());
      readingYearlyRecordsDto.setAuthor(yearlyBookRecord.getAuthor());
      readingYearlyRecordsDtoList.add(readingYearlyRecordsDto);
    }
    // 返却用のMapに格納
    readingRecordsDtoListMap.put(MONTHLY_GOAL, readingMonthlyRecordsDtoList);
    readingRecordsDtoListMap.put(YEARLY_GOAL, readingYearlyRecordsDtoList);
    return readingRecordsDtoListMap;
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
