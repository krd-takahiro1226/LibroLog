package com.readrecords.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.entity.ReadRecords;

import jakarta.transaction.Transactional;

@Repository
public interface ReadRecordsRepository extends CrudRepository<ReadRecords, Integer> {
  @Query(name = "UserReadRecordsDto.getReadRecordsByUserId", nativeQuery = true)
  List<UserReadRecordsDto> getReadRecordsByUserId(@Param("user_id") String user_id);

  @Query(value = "select * from " + "read_records where ISBN = :ISBN", nativeQuery = true)
  List<ReadRecords> getReadRecordsByISBN(@Param("ISBN") String ISBN);
  
  @Modifying
  @Transactional
  @Query(value = "insert into read_records " + "(ISBN, user_id, start_date, end_date, read_count, priority, memo) values " + "(:ISBN, :user_id, :start_date, :end_date, :read_count, :priority, :memo)", nativeQuery = true)
      void insertReadRecords(@Param("ISBN") String ISBN, @Param("user_id") String user_id,
      @Param("start_date") String start_date, @Param("end_date") String end_date,
      @Param("read_count") int read_count, @Param("priority") int priority,
      @Param("memo") String memo);
}
