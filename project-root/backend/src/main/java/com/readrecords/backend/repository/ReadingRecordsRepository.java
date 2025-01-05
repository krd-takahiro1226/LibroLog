package com.readrecords.backend.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.ReadingRecords;

@Repository
public interface ReadingRecordsRepository {
  @Query(value = "select * from " + "reading_records where user_id = :user_id", nativeQuery = true)
  List<ReadingRecords> getReadingMonthlyRecordsByUserId(@Param("user_id") String userId);
  
  @Query(value = "select * from " + "reading_records where user_id = :user_id", nativeQuery = true)
  List<ReadingRecords> getReadingYearlyRecordsByUserId(@Param("user_id") String userId);
  
  /**
   * 指定した日付(=目標の終了日)までに読了フラグが立っているレコード数を計算し、読んだ本の冊数を返却する
   * @param userId
   * @param yearlyCountEndDate
   * @return 期間内に読んだ本の冊数
   */
  @Query(value = "select count(1) from " + "reading_records where user_id = :user_id" + " and count_start_date <= :goals_count_end_date" + " and count_end_date >= :goals_count_end_date"+ " and is_read_done = true" + " order by count_end_date desc", nativeQuery = true)
  int getBooksCountByUserId(@Param("user_id") String userId, @Param("goals_count_end_date") Date goalsCountEndDate);
} 
