package com.readrecords.backend.repository;

import com.readrecords.backend.entity.ReadingGoals;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
