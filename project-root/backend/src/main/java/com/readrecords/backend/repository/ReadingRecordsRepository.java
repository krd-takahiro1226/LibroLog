package com.readrecords.backend.repository;

import com.readrecords.backend.entity.ReadingRecords;
import java.sql.Date;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingRecordsRepository extends CrudRepository<ReadingRecords, Integer> {
  /**
   * 指定した日付(=目標の終了日)までに読了フラグが立っているレコード数を計算し、月間で読んだ本の冊数を返却する
   *
   * @param userId
   * @param monthlyCountEndDate
   * @return 月間で読んだ本の冊数
   */
  @Query(
      value =
          "select count(1) from "
              + "reading_records where user_id = :user_id"
              + " and read_start_date <= :goals_count_end_date"
              + " and read_end_date >= :goals_count_end_date"
              + " and is_read_done = true",
      nativeQuery = true)
  int getMonthlyBooksCountByUserId(
      @Param("user_id") String userId, @Param("goals_count_end_date") Date goalsCountEndDate);

  /**
   * 指定した日付(=目標の終了日)までに読了フラグが立っているレコード数を計算し、年間で読んだ本の冊数を返却する
   *
   * @param userId
   * @param yearlyCountEndDate
   * @return 年間で読んだ本の冊数
   */
  @Query(
      value =
          "select count(1) from "
              + "reading_records where user_id = :user_id"
              + " and read_end_date <= :goals_count_end_date"
              + " and is_read_done = true",
      nativeQuery = true)
  int getYearlyBooksCountByUserId(
      @Param("user_id") String userId, @Param("goals_count_end_date") Date goalsCountEndDate);
}
