package com.readrecords.backend.service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.ReadingAchievementsDto;
import com.readrecords.backend.entity.ReadingGoals;
import com.readrecords.backend.repository.ReadingGoalsRepository;
import com.readrecords.backend.repository.ReadingRecordsRepository;


@Service
public class ReadingAchievementsServiceImpl implements ReadingAchievementsService {
  @Autowired
  ReadingGoalsRepository readingGoalsRepository;

  @Autowired
  ReadingRecordsRepository readingRecordsRepository;

  private final String DATE_FORMAT = "yyyyMMdd";

  private static final Logger logger = LoggerFactory.getLogger(ReadingAchievementsServiceImpl.class);

  @Override
  public ReadingAchievementsDto getReadAchievementsByUserId(String userId) {
  // 返却用のDTOを作成
  ReadingAchievementsDto readingAchievementsDto = new ReadingAchievementsDto();
  // 実行日付を取得
  Calendar calender = Calendar.getInstance();
  SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
  String excecuteDate = dateFormat.format(calender.getTime());

  // 読書冊数目標管理テーブルからユーザのレコードを取得、フラグに応じて年間目標と月間目標を別々のDTOに格納
  // TODO 特に月間目標は複数取得されるため、SQLクエリでorder byなどする必要がありそう
  List<ReadingGoals> userReadingGoals = readingGoalsRepository.getReadingGoalsByUserId(userId, excecuteDate);
  logger.info("読書目標: {}" , userReadingGoals);
  ReadingGoals userYearlyReadingGoals = userReadingGoals.stream().filter(s -> s.isYearGoal()).findFirst().orElse(null);
  logger.info("年間目標: {}" , userYearlyReadingGoals);
  ReadingGoals userMonthlyReadingGoals = userReadingGoals.stream().filter(s -> !s.isYearGoal()).findFirst().orElse(null);
  logger.info("月間目標: {}" , userMonthlyReadingGoals);

  // 年間目標に対する処理
  // 年間目標の目標冊数を取得
  int yearlyGoal = userYearlyReadingGoals.getGoalReadNumber();
  // 年間目標の終了日を取得
  Date yearlyCountEndDate = userYearlyReadingGoals.getCountEndDate();
  // 年間目標冊数の取得および達成率を計算し、格納
  int yearlyTotalBooks = readingRecordsRepository.getYearlyBooksCountByUserId(userId, yearlyCountEndDate);
  double yearlyPercentage = (double)yearlyTotalBooks / yearlyGoal;
  readingAchievementsDto.setYearlyTotalBooks(yearlyTotalBooks);
  readingAchievementsDto.setYearlyGoal(yearlyGoal);
  readingAchievementsDto.setYearlyPercentage(yearlyPercentage);

  // 月間目標に対する処理
  // 月間目標の終了日を取得
  Date monthlyCountEndDate = userMonthlyReadingGoals.getCountEndDate();
  // 月間目標冊数の取得および達成率を計算し、格納
  int monthlyTotalBooks = readingRecordsRepository.getMonthlyBooksCountByUserId(userId, monthlyCountEndDate);
  readingAchievementsDto.setMonthlyRead(monthlyTotalBooks);
  readingAchievementsDto.setMonthlyGoal(userMonthlyReadingGoals.getGoalReadNumber());

  return readingAchievementsDto;
  }
}
