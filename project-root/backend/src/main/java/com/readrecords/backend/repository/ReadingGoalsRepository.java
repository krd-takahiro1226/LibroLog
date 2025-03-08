package com.readrecords.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.ReadingGoals;

import jakarta.transaction.Transactional;

@Repository
public interface ReadingGoalsRepository
                extends CrudRepository<ReadingGoals, Integer> {
        // TODO 有効期間内に複数登録されていたら、返り値は複数になるのでそうならないような修正、もしくは返り値の変更が必要
        @Query(value = "select * from reading_goals"
                        + " where user_id = :user_id"
                        + " and count_start_date <= :excecute_date"
                        + " and count_end_date >= :excecute_date", nativeQuery = true)
        List<ReadingGoals> getReadingGoalsByUserId(
                        @Param("user_id") String userId,
                        @Param("excecute_date") String excecuteDate);

        @Modifying
        @Transactional
        @Query(value = "insert into reading_goals "
                        + "(goal_read_number, user_id, count_start_date, count_end_date, is_year_goal) values "
                        + "(:goalReadNumber, :userId, :countStartDate, :countEndDate, 0)", nativeQuery = true)
        void insertReadingMonthlyGoals(
                        @Param("goalReadNumber") int goalReadNumber,
                        @Param("userId") String userId,
                        @Param("countStartDate") String countStartDate,
                        @Param("countEndDate") String countEndDate);

        @Modifying
        @Transactional
        @Query(value = "insert into reading_goals "
                        + "(goal_read_number, user_id, count_start_date, count_end_date, is_year_goal) values "
                        + "(:goalReadNumber, :userId, :countStartDate, :countEndDate, 1)", nativeQuery = true)
        void insertReadingYearlyGoals(
                        @Param("goalReadNumber") int goalReadNumber,
                        @Param("userId") String userId,
                        @Param("countStartDate") String countStartDate,
                        @Param("countEndDate") String countEndDate);

        @Query(value = "SELECT goal_id FROM reading_goals" + " WHERE user_id = :user_id"
                        + " AND CURRENT_DATE BETWEEN count_start_date AND count_end_date and is_year_goal = '0'", nativeQuery = true)
        String getMonthlyGoalIdByUserIdAndCurrentDate(
                        @Param("user_id") String userId);

        @Query(value = "SELECT goal_id FROM reading_goals" + " WHERE user_id = :user_id"
                        + " AND CURRENT_DATE BETWEEN count_start_date AND count_end_date and is_year_goal = '1'", nativeQuery = true)
        String getYearlyGoalIdByUserIdAndCurrentDate(
                        @Param("user_id") String userId);

        @Query(value = "SELECT goal_read_number FROM reading_goals" + " WHERE goal_id = :goal_id", nativeQuery = true)
        int getGoalReadNumberByGoalId(
                        @Param("goal_id") String goalId);
}
